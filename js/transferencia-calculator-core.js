(function initTransferenciaCalculator(globalScope) {
  'use strict';

  const STAMP_RATE = 0.03;
  const MONTHLY_INTEREST_RATE = 0.0589;
  const AUTO_REGISTRATION_RATE = 0.01;

  const BUYER_RESIDENCE_IGNORED_WARNING =
    'titularNuevoTieneDomicilioEnMisiones no afecta el calculo matematico actual.';
  const HOLIDAYS_ESTIMATE_WARNING =
    'No se informo un calendario de feriados. Los dias habiles se calculan solo excluyendo sabados y domingos.';
  const ACARA_ESTIMATE_WARNING =
    'No se informo valorACARA. La base se calculo solo con precioCompra y el resultado queda estimado.';
  const MOTORCYCLE_MODEL_BASE_WARNING =
    'Se uso fechaModeloBase para antiguedad de moto. Es un fallback estimado; funcionalmente conviene fechaPrimeraInscripcion.';
  const MOTO_REFERENCE_DATE_WARNING =
    'La referencia para antiguedad de moto se tomo sobre fechaLiquidacion. Si operativamente corresponde otra fecha, hay que configurarla.';
  const MULTA_BOUNDARY_WARNING =
    'La multa usa esta interpretacion: primer tramo por hasta 15 dias habiles de mora; tramos siguientes por ventanas de meses calendario contadas desde el inicio de la mora.';

  class TransferenciaCalculationError extends Error {
    constructor(code, message, details) {
      super(message);
      this.name = 'TransferenciaCalculationError';
      this.code = code;
      this.details = details || null;
    }
  }

  function calculateTransferencia(input, options = {}) {
    const warnings = [];
    const normalized = normalizeInput(input);
    const holidaySet = buildHolidaySet(options.holidays || []);

    if (!options.holidays || options.holidays.length === 0) {
      warnings.push(HOLIDAYS_ESTIMATE_WARNING);
    }

    if (normalized.titularNuevoTieneDomicilioEnMisiones !== undefined) {
      warnings.push(BUYER_RESIDENCE_IGNORED_WARNING);
    }

    const fechaInstrumentoEfectiva = resolveFechaInstrumentoEfectiva(
      normalized.fechaFirmaVendedor,
      normalized.fechaFirmaComprador
    );

    const fechaLiquidacion = normalized.fechaLiquidacion || todayDateOnly();

    if (compareDates(fechaLiquidacion, fechaInstrumentoEfectiva) < 0) {
      throw new TransferenciaCalculationError(
        'INVALID_LIQUIDATION_DATE',
        'fechaLiquidacion no puede ser anterior a la fechaInstrumentoEfectiva.',
        {
          fechaLiquidacion: formatDateKey(fechaLiquidacion),
          fechaInstrumentoEfectiva: formatDateKey(fechaInstrumentoEfectiva)
        }
      );
    }

    const fechaVencimiento = addBusinessDays(fechaInstrumentoEfectiva, 15, holidaySet);

    const stampBaseInfo = resolveTaxBase({
      precioCompra: normalized.precioCompra,
      valorACARA: normalized.valorACARA
    });

    if (stampBaseInfo.estimated) {
      warnings.push(ACARA_ESTIMATE_WARNING);
    }

    const liquidacionSellos = round2(stampBaseInfo.base * STAMP_RATE);
    const interes = calculateInteres({
      liquidacionSellos,
      fechaVencimiento,
      fechaLiquidacion
    });

    const multaInfo = calculateMulta({
      liquidacionSellos,
      fechaVencimiento,
      fechaLiquidacion,
      holidaySet
    });

    warnings.push(MULTA_BOUNDARY_WARNING);

    const registrationInfo = resolveRegistroInfo({
      input: normalized,
      fechaInstrumentoEfectiva,
      fechaLiquidacion,
      defaultBaseStrategy: options.registrationBaseStrategy || 'max_price_vs_acara',
      motoAgeReferenceDateStrategy: options.motoAgeReferenceDateStrategy || 'fechaLiquidacion'
    });

    warnings.push(...registrationInfo.warnings);

    const tasa = 0;
    const totalAPagar = round2(
      liquidacionSellos +
      tasa +
      interes +
      multaInfo.multa +
      registrationInfo.precioRegistro
    );

    const estimated =
      stampBaseInfo.estimated ||
      registrationInfo.estimated ||
      (!options.holidays || options.holidays.length === 0);

    return {
      fechaInstrumentoEfectiva,
      fechaVencimiento,
      fechaLiquidacion,
      baseImponible: stampBaseInfo.base,
      liquidacionSellos,
      tasa,
      interes,
      multa: multaInfo.multa,
      baseRegistro: registrationInfo.baseRegistro,
      tasaRegistro: registrationInfo.tasaRegistro,
      precioRegistro: registrationInfo.precioRegistro,
      totalAPagar,
      detalle: {
        diasHabilesMora: multaInfo.diasHabilesMora,
        fechaInicioMora: multaInfo.fechaInicioMora,
        moto: registrationInfo.moto || null,
        baseImponibleEstimado: stampBaseInfo.estimated,
        baseRegistroEstimado: registrationInfo.estimated
      },
      meta: {
        estimated,
        warnings: uniqueStrings(warnings),
        sources: {
          valorFiscal: normalized.valorACARA != null ? 'valorACARA' : 'precioCompra',
          baseRegistroStrategy: registrationInfo.baseStrategy,
          motoAgeSource: registrationInfo.moto ? registrationInfo.moto.ageSource : null
        }
      }
    };
  }

  function normalizeInput(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new TransferenciaCalculationError(
        'INVALID_INPUT',
        'El input de la calculadora debe ser un objeto.'
      );
    }

    const tipoVehiculo = raw.tipoVehiculo;
    if (tipoVehiculo !== 'auto' && tipoVehiculo !== 'moto') {
      throw new TransferenciaCalculationError(
        'INVALID_VEHICLE_TYPE',
        'tipoVehiculo debe ser "auto" o "moto".'
      );
    }

    const precioCompra = assertPositiveNumber(raw.precioCompra, 'precioCompra');
    const valorACARA = raw.valorACARA == null ? null : assertPositiveNumber(raw.valorACARA, 'valorACARA');

    return {
      tipoVehiculo,
      titularNuevoTieneDomicilioEnMisiones: raw.titularNuevoTieneDomicilioEnMisiones,
      precioCompra,
      valorACARA,
      fechaFirmaVendedor: coerceOptionalDate(raw.fechaFirmaVendedor, 'fechaFirmaVendedor'),
      fechaFirmaComprador: coerceOptionalDate(raw.fechaFirmaComprador, 'fechaFirmaComprador'),
      antiguedadFirmaVendedor: raw.antiguedadFirmaVendedor || null,
      antiguedadFirmaComprador: raw.antiguedadFirmaComprador || null,
      fechaLiquidacion: raw.fechaLiquidacion ? coerceOptionalDate(raw.fechaLiquidacion, 'fechaLiquidacion') : null,
      fechaPrimeraInscripcion: coerceOptionalDate(raw.fechaPrimeraInscripcion, 'fechaPrimeraInscripcion'),
      fechaPatentamiento: coerceOptionalDate(raw.fechaPatentamiento, 'fechaPatentamiento'),
      fechaModeloBase: coerceOptionalDate(raw.fechaModeloBase, 'fechaModeloBase'),
      antiguedadVehiculoExacta: raw.antiguedadVehiculoExacta == null
        ? null
        : assertNonNegativeNumber(raw.antiguedadVehiculoExacta, 'antiguedadVehiculoExacta')
    };
  }

  function resolveFechaInstrumentoEfectiva(fechaFirmaVendedor, fechaFirmaComprador) {
    if (!fechaFirmaVendedor || !fechaFirmaComprador) {
      throw new TransferenciaCalculationError(
        'MISSING_SIGNATURE_DATES',
        'Para calcular fechaInstrumentoEfectiva, fechaVencimiento, interes y multa necesitas las dos fechas exactas: fechaFirmaVendedor y fechaFirmaComprador.'
      );
    }

    return maxDate([fechaFirmaVendedor, fechaFirmaComprador]);
  }

  function resolveTaxBase({ precioCompra, valorACARA }) {
    if (valorACARA == null) {
      return {
        base: precioCompra,
        estimated: true
      };
    }

    return {
      base: Math.max(precioCompra, valorACARA),
      estimated: false
    };
  }

  function resolveRegistroInfo({
    input,
    fechaInstrumentoEfectiva,
    fechaLiquidacion,
    defaultBaseStrategy,
    motoAgeReferenceDateStrategy
  }) {
    const warnings = [];
    const supportedStrategies = new Set(['max_price_vs_acara', 'dnrpa_priority', 'price_only']);
    const baseStrategy = supportedStrategies.has(defaultBaseStrategy)
      ? defaultBaseStrategy
      : 'dnrpa_priority';

    const baseRegistroInfo = resolveRegistrationBase({
      precioCompra: input.precioCompra,
      valorACARA: input.valorACARA,
      strategy: baseStrategy
    });

    if (baseRegistroInfo.estimated) {
      warnings.push(ACARA_ESTIMATE_WARNING);
    }

    if (input.tipoVehiculo === 'auto') {
      return {
        baseRegistro: baseRegistroInfo.base,
        baseStrategy,
        tasaRegistro: AUTO_REGISTRATION_RATE,
        precioRegistro: round2(baseRegistroInfo.base * AUTO_REGISTRATION_RATE),
        estimated: baseRegistroInfo.estimated,
        warnings
      };
    }

    const motoAgeInfo = resolveMotoAgeInfo({
      input,
      fechaLiquidacion,
      fechaInstrumentoEfectiva,
      referenceDateStrategy: motoAgeReferenceDateStrategy
    });

    warnings.push(...motoAgeInfo.warnings);

    const precioRegistro = round2(baseRegistroInfo.base * motoAgeInfo.tasaRegistro);

    return {
      baseRegistro: baseRegistroInfo.base,
      baseStrategy,
      tasaRegistro: motoAgeInfo.tasaRegistro,
      precioRegistro,
      estimated: baseRegistroInfo.estimated || motoAgeInfo.estimated,
      warnings,
      moto: {
        ageSource: motoAgeInfo.ageSource,
        ageReferenceDate: motoAgeInfo.referenceDate,
        antiguedadDias: motoAgeInfo.antiguedadDias
      }
    };
  }

  function resolveRegistrationBase({ precioCompra, valorACARA, strategy }) {
    if (strategy === 'price_only') {
      return {
        base: precioCompra,
        estimated: valorACARA == null
      };
    }

    if (strategy === 'dnrpa_priority') {
      return {
        base: valorACARA == null ? precioCompra : valorACARA,
        estimated: valorACARA == null
      };
    }

    if (valorACARA == null) {
      return {
        base: precioCompra,
        estimated: true
      };
    }

    return {
      base: Math.max(precioCompra, valorACARA),
      estimated: false
    };
  }

  function resolveMotoAgeInfo({ input, fechaLiquidacion, fechaInstrumentoEfectiva, referenceDateStrategy }) {
    const warnings = [];
    const referenceDate = referenceDateStrategy === 'fechaInstrumentoEfectiva'
      ? fechaInstrumentoEfectiva
      : fechaLiquidacion;

    if (referenceDateStrategy !== 'fechaInstrumentoEfectiva' && referenceDateStrategy !== 'fechaLiquidacion') {
      throw new TransferenciaCalculationError(
        'INVALID_MOTO_REFERENCE_DATE_STRATEGY',
        'motoAgeReferenceDateStrategy debe ser "fechaLiquidacion" o "fechaInstrumentoEfectiva".'
      );
    }

    if (referenceDateStrategy === 'fechaLiquidacion') {
      warnings.push(MOTO_REFERENCE_DATE_WARNING);
    }

    if (input.antiguedadVehiculoExacta != null) {
      return {
        tasaRegistro: resolveMotoRateFromYears(input.antiguedadVehiculoExacta),
        ageSource: 'antiguedadVehiculoExacta',
        antiguedadDias: null,
        referenceDate,
        estimated: false,
        warnings
      };
    }

    const source = resolveMotoAgeSource(input);
    const antiguedadDias = differenceInCalendarDays(source.date, referenceDate);

    if (source.kind === 'fechaModeloBase') {
      warnings.push(MOTORCYCLE_MODEL_BASE_WARNING);
    }

    return {
      tasaRegistro: resolveMotoRateFromDateDiff(source.date, referenceDate),
      ageSource: source.kind,
      antiguedadDias,
      referenceDate,
      estimated: source.kind === 'fechaModeloBase',
      warnings
    };
  }

  function resolveMotoAgeSource(input) {
    if (input.fechaPrimeraInscripcion) {
      return {
        kind: 'fechaPrimeraInscripcion',
        date: input.fechaPrimeraInscripcion
      };
    }

    if (input.fechaPatentamiento) {
      return {
        kind: 'fechaPatentamiento',
        date: input.fechaPatentamiento
      };
    }

    if (input.fechaModeloBase) {
      return {
        kind: 'fechaModeloBase',
        date: input.fechaModeloBase
      };
    }

    throw new TransferenciaCalculationError(
      'MISSING_MOTORCYCLE_AGE_SOURCE',
      'Para motos falta fechaPrimeraInscripcion o, en su defecto, fechaPatentamiento. fechaModeloBase solo deberia usarse como fallback estimado.'
    );
  }

  function resolveMotoRateFromYears(antiguedadVehiculoExacta) {
    if (antiguedadVehiculoExacta <= (90 / 365)) return 0.01;
    if (antiguedadVehiculoExacta <= 1) return 0.012;
    if (antiguedadVehiculoExacta <= 2) return 0.014;
    if (antiguedadVehiculoExacta <= 3) return 0.016;
    if (antiguedadVehiculoExacta <= 4) return 0.018;
    return 0.02;
  }

  function resolveMotoRateFromDateDiff(fechaBase, fechaReferencia) {
    const ageDays = differenceInCalendarDays(fechaBase, fechaReferencia);
    if (ageDays <= 90) return 0.01;
    if (compareDates(fechaReferencia, addYearsClamped(fechaBase, 1)) <= 0) return 0.012;
    if (compareDates(fechaReferencia, addYearsClamped(fechaBase, 2)) <= 0) return 0.014;
    if (compareDates(fechaReferencia, addYearsClamped(fechaBase, 3)) <= 0) return 0.016;
    if (compareDates(fechaReferencia, addYearsClamped(fechaBase, 4)) <= 0) return 0.018;
    return 0.02;
  }

  function calculateRegistrationRate(params) {
    if (!params || typeof params !== 'object') {
      throw new TransferenciaCalculationError(
        'INVALID_INPUT',
        'calcularTasaRegistro requiere un objeto de parametros.'
      );
    }

    if (params.tipoVehiculo === 'auto') {
      return AUTO_REGISTRATION_RATE;
    }

    if (params.tipoVehiculo !== 'moto') {
      throw new TransferenciaCalculationError(
        'INVALID_VEHICLE_TYPE',
        'tipoVehiculo debe ser "auto" o "moto".'
      );
    }

    if (params.antiguedadMotoExacta != null) {
      return resolveMotoRateFromYears(assertNonNegativeNumber(params.antiguedadMotoExacta, 'antiguedadMotoExacta'));
    }

    const fechaBase = coerceOptionalDate(
      params.fechaPrimeraInscripcionMoto || params.fechaPrimeraInscripcion || params.fechaPatentamiento || params.fechaModeloBase,
      'fechaPrimeraInscripcionMoto'
    );
    const fechaReferencia = coerceOptionalDate(
      params.fechaReferencia || params.fechaLiquidacion || params.fechaInstrumentoEfectiva,
      'fechaReferencia'
    );

    if (!fechaBase || !fechaReferencia) {
      throw new TransferenciaCalculationError(
        'MISSING_MOTORCYCLE_AGE_SOURCE',
        'Para calcular la tasa de moto necesitas antiguedadMotoExacta o una fecha base y una fecha de referencia.'
      );
    }

    return resolveMotoRateFromDateDiff(fechaBase, fechaReferencia);
  }

  function calculateInteres({ liquidacionSellos, fechaVencimiento, fechaLiquidacion }) {
    if (compareDates(fechaLiquidacion, fechaVencimiento) <= 0) {
      return 0;
    }

    const moraStart = addCalendarDays(fechaVencimiento, 1);
    let cursor = cloneDate(moraStart);
    let factor = 0;

    while (compareDates(cursor, fechaLiquidacion) <= 0) {
      const currentMonthEnd = endOfMonth(cursor);
      const segmentEnd = minDate(currentMonthEnd, fechaLiquidacion);
      const diasMoraDelMes = differenceInCalendarDays(cursor, segmentEnd) + 1;
      const diasTotalesDelMes = daysInMonth(cursor);

      factor += diasMoraDelMes / diasTotalesDelMes;
      cursor = addCalendarDays(segmentEnd, 1);
    }

    return round2(liquidacionSellos * MONTHLY_INTEREST_RATE * factor);
  }

  function calculateMulta({ liquidacionSellos, fechaVencimiento, fechaLiquidacion, holidaySet }) {
    if (compareDates(fechaLiquidacion, fechaVencimiento) <= 0) {
      return {
        multa: 0,
        diasHabilesMora: 0,
        fechaInicioMora: null
      };
    }

    const fechaInicioMora = addCalendarDays(fechaVencimiento, 1);
    const diasHabilesMora = countBusinessDaysBetween(fechaVencimiento, fechaLiquidacion, holidaySet);
    let factor = 0;

    if (diasHabilesMora <= 15) {
      factor = 0.1;
    } else if (compareDates(fechaLiquidacion, inclusiveMonthWindowEnd(fechaInicioMora, 3)) <= 0) {
      factor = 0.5;
    } else if (compareDates(fechaLiquidacion, inclusiveMonthWindowEnd(fechaInicioMora, 6)) <= 0) {
      factor = 1.0;
    } else if (compareDates(fechaLiquidacion, inclusiveMonthWindowEnd(fechaInicioMora, 9)) <= 0) {
      factor = 1.5;
    } else if (compareDates(fechaLiquidacion, inclusiveMonthWindowEnd(fechaInicioMora, 12)) <= 0) {
      factor = 2.0;
    } else {
      factor = 2.5;
    }

    return {
      multa: round2(liquidacionSellos * factor),
      diasHabilesMora,
      fechaInicioMora
    };
  }

  function inclusiveMonthWindowEnd(startDate, months) {
    const anniversary = addMonthsClamped(startDate, months);
    if (anniversary.getDate() === startDate.getDate()) {
      return addCalendarDays(anniversary, -1);
    }
    return anniversary;
  }

  function addBusinessDays(startDate, businessDaysToAdd, holidaySet) {
    let remaining = businessDaysToAdd;
    const cursor = cloneDate(startDate);

    while (remaining > 0) {
      cursor.setDate(cursor.getDate() + 1);
      if (isBusinessDay(cursor, holidaySet)) {
        remaining -= 1;
      }
    }

    return stripTime(cursor);
  }

  function countBusinessDaysBetween(startExclusive, endInclusive, holidaySet) {
    if (compareDates(endInclusive, startExclusive) <= 0) {
      return 0;
    }

    let count = 0;
    const cursor = cloneDate(startExclusive);

    while (compareDates(cursor, endInclusive) < 0) {
      cursor.setDate(cursor.getDate() + 1);
      if (isBusinessDay(cursor, holidaySet)) {
        count += 1;
      }
    }

    return count;
  }

  function buildHolidaySet(holidays) {
    return new Set((holidays || []).map(date => formatDateKey(coerceOptionalDate(date, 'holiday'))));
  }

  function isBusinessDay(date, holidaySet) {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false;
    }
    return !holidaySet.has(formatDateKey(date));
  }

  function assertPositiveNumber(value, fieldName) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue <= 0) {
      throw new TransferenciaCalculationError(
        'INVALID_NUMBER',
        `${fieldName} debe ser un numero mayor a 0.`,
        {
          fieldName,
          value
        }
      );
    }
    return numberValue;
  }

  function assertNonNegativeNumber(value, fieldName) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0) {
      throw new TransferenciaCalculationError(
        'INVALID_NUMBER',
        `${fieldName} debe ser un numero mayor o igual a 0.`,
        {
          fieldName,
          value
        }
      );
    }
    return numberValue;
  }

  function coerceOptionalDate(value, fieldName) {
    if (value == null || value === '') return null;

    let date;

    if (value instanceof Date) {
      date = new Date(value.getTime());
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      throw new TransferenciaCalculationError(
        'INVALID_DATE',
        `${fieldName} no es una fecha valida.`,
        {
          fieldName,
          value
        }
      );
    }

    return stripTime(date);
  }

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function todayDateOnly() {
    return stripTime(new Date());
  }

  function cloneDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function compareDates(a, b) {
    return stripTime(a).getTime() - stripTime(b).getTime();
  }

  function maxDate(dates) {
    return dates.reduce((latest, current) => (compareDates(current, latest) > 0 ? current : latest));
  }

  function minDate(a, b) {
    return compareDates(a, b) <= 0 ? a : b;
  }

  function addCalendarDays(date, days) {
    const result = cloneDate(date);
    result.setDate(result.getDate() + days);
    return stripTime(result);
  }

  function addMonthsClamped(date, months) {
    const originalDay = date.getDate();
    const targetYear = date.getFullYear();
    const targetMonthIndex = date.getMonth() + months;
    const year = targetYear + Math.floor(targetMonthIndex / 12);
    const month = ((targetMonthIndex % 12) + 12) % 12;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const day = Math.min(originalDay, lastDay);
    return new Date(year, month, day);
  }

  function addYearsClamped(date, years) {
    return addMonthsClamped(date, years * 12);
  }

  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function daysInMonth(date) {
    return endOfMonth(date).getDate();
  }

  function differenceInCalendarDays(startDate, endDate) {
    const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.floor((utcEnd - utcStart) / 86400000);
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function round2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function uniqueStrings(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  const api = {
    TransferenciaCalculationError,
    calculateTransferencia,
    calcularTransferencia: calculateTransferencia,
    addBusinessDays,
    agregarDiasHabiles: addBusinessDays,
    countBusinessDaysBetween,
    contarDiasHabiles: countBusinessDaysBetween,
    calculateInteres,
    calcularInteresProrrateadoPorMes: calculateInteres,
    calculateMulta,
    calcularMulta: calculateMulta,
    calculateRegistrationRate,
    calcularTasaRegistro: calculateRegistrationRate,
    resolveFechaInstrumentoEfectiva,
    resolveMotoAgeSource,
    resolveMotoRateFromDateDiff,
    formatDateKey
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalScope.TransferenciaCalculatorCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
