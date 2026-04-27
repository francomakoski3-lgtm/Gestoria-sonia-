const WA_NUMBER = '543743668039';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

const cache = {
  autosPromise: null,
  propertiesPromise: null,
  serviceSettingsPromise: null
};

const GESTORIA_SERVICE_DETAILS = {
  transferencias: {
    documentTitle: 'Transferencia automotor en Argentina',
    kicker: '',
    title: 'Transferencia automotor en Argentina',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Gestionamos la transferencia de autos y motos en toda Argentina para que el tr&aacute;mite sea m&aacute;s simple, claro y seguro. Te ayudamos a revisar la documentaci&oacute;n necesaria, los costos aproximados y el paso a paso para realizar la transferencia correctamente.',
    highlights: [
      {
        iconImg: 'img/services/Clock.png',
        iconAlt: 'Reloj',
        label: 'Tiempo estimado',
        value: '1 d&iacute;a h&aacute;bil'
      },
      {
        iconImg: 'img/services/Misiones.png',
        iconAlt: 'Provincia de Misiones',
        label: 'Especializaci&oacute;n',
        value: 'Provincia de Misiones'
      },
      {
        iconImg: 'img/services/Calculadora.png',
        iconAlt: 'Calculadora',
        label: 'Estimado',
        value: 'Calculadora online'
      },
      {
        iconImg: 'img/services/experiencia.png',
        iconAlt: 'Experiencia',
        label: 'Experiencia',
        value: '+ 19 A&ntilde;os'
      }
    ],
    detailSections: [
      {
        title: '&iquest;Qu&eacute; necesito?',
        items: [
          'T&iacute;tulo.',
          'C&eacute;dula.',
          'Formulario 08 debidamente firmado.',
          'Formulario 12, verificaci&oacute;n policial.',
          'DNI del comprador.'
        ]
      },
      {
        title: 'Tiempo estimado del tr&aacute;mite',
        text: 'Aproximadamente 1 d&iacute;a h&aacute;bil normalmente. Seg&uacute;n el caso, el tr&aacute;mite puede demorar hasta 3 d&iacute;as.'
      },
      {
        title: 'Costo',
        text: 'El valor puede variar seg&uacute;n el veh&iacute;culo, la documentaci&oacute;n presentada y los gastos registrales del tr&aacute;mite.'
      },
      {
        title: 'Medios de pago',
        paymentLogos: [
          'img/payment/payment-1.png',
          'img/payment/payment-mastercard.png',
          'img/payment/payment-visa.png',
          'img/payment/payment-american-express.png',
          'img/payment/payment-naranja.png',
          'img/payment/payment-pagofacil.png',
          'img/payment/payment-rapipago.png',
          'img/payment/payment-2.png',
          'img/payment/payment-5.png',
          'img/payment/payment-btc.svg',
          'img/payment/payment-usdt.svg'
        ]
      }
    ],
    ctaLabel: 'Consultar por WhatsApp',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20una%20transferencia%20de%20auto%20o%20moto.',
    secondaryLabel: 'Iniciar tr&aacute;mite',
    secondaryHref: 'cotizar-transferencia',
    secondaryClass: 'btn-service-start',
    hidePrimaryCta: true,
    includeCalculator: false
  },
  'informe-dominio': {
    documentTitle: 'Informe de dominio',
    kicker: '',
    title: 'Informe de dominio',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Pod&eacute;s solicitar el informe de dominio hist&oacute;rico o el informe de dominio actual para conocer la trayectoria registral completa o la situaci&oacute;n vigente del veh&iacute;culo.',
    highlights: [
      {
        iconImg: 'img/services/informe-papers.png',
        iconAlt: 'Papeles de informe',
        label: 'Tipos de informe',
        value: 'Hist&oacute;rico y actual'
      },
      {
        iconImg: 'img/services/informe-online.png',
        iconAlt: 'Tr&aacute;mite online',
        label: 'Modalidad',
        value: 'Online'
      },
      {
        iconImg: 'img/services/bandera-argentina.png',
        iconAlt: 'Bandera argentina',
        label: 'Cobertura',
        value: 'Nacional'
      },
      {
        iconImg: 'img/services/Clock.png',
        iconAlt: 'Reloj',
        label: 'Tiempo estimado',
        value: '1 d&iacute;a h&aacute;bil'
      }
    ],
    detailSections: [
      {
        title: 'Informe de dominio hist&oacute;rico',
        text: 'El informe de dominio hist&oacute;rico permite conocer toda la trayectoria registral de un veh&iacute;culo desde su inscripci&oacute;n inicial hasta la actualidad.',
        items: [
          'Todos los titulares que tuvo el veh&iacute;culo.',
          'Transferencias realizadas.',
          'Cambios de radicaci&oacute;n.',
          'Prendas, embargos u otras medidas.',
          'Datos completos desde el origen del automotor.'
        ],
        listStyle: 'dashes'
      },
      {
        title: '&iquest;Para qu&eacute; sirve el hist&oacute;rico?',
        items: [
          'Realizar altas y bajas municipales correctamente.',
          'Verificar la situaci&oacute;n del veh&iacute;culo respecto al pago de patentes.',
          'Analizar el historial completo antes de tomar decisiones importantes.'
        ],
        listStyle: 'dashes'
      },
      {
        title: '&iquest;Qu&eacute; incluye este informe?',
        text: 'El informe de dominio es totalmente online, se solicita con el n&uacute;mero de dominio y permite conocer la situaci&oacute;n actual del veh&iacute;culo.',
        items: [
          'Identificaci&oacute;n del veh&iacute;culo: n&uacute;mero de chasis, n&uacute;mero de motor, modelo y a&ntilde;o.',
          'Origen registral: si el veh&iacute;culo es nacional o importado y fecha de inscripci&oacute;n inicial.',
          'Titular vigente: nombre completo, DNI, CUIL y domicilio del titular actual.',
          'Estado registral actualizado: datos vigentes del dominio y situaci&oacute;n jur&iacute;dica actual.',
          'Medidas o restricciones: denuncia de venta, prohibici&oacute;n para circular, prenda, embargo o inhibici&oacute;n, si existen.',
          'Conclusi&oacute;n pr&aacute;ctica: permite evaluar si el veh&iacute;culo est&aacute; en condiciones legales para transferirse.'
        ],
        listStyle: 'numbered'
      },
      {
        title: '&iquest;Para qu&eacute; sirve el actual?',
        items: [
          'Compra o venta de buena fe.',
          'Verificar que el veh&iacute;culo est&eacute; en condiciones legales para transferir.'
        ],
        listStyle: 'dashes'
      },
      {
        title: '&iquest;Qu&eacute; necesit&aacute;s?',
        items: [
          'N&uacute;mero de dominio o chapa patente.'
        ],
        listStyle: 'dashes'
      },
      {
        title: 'Valor',
        prices: [
          { label: 'Auto', value: '$30.000', iconImg: 'img/services/coche.svg', iconAlt: 'Auto' },
          { label: 'Moto', value: '$25.000', iconImg: 'img/services/moto.svg', iconAlt: 'Moto' }
        ]
      },
      {
        title: 'Medios de pago',
        paymentLogos: [
          'img/payment/payment-1.png',
          'img/payment/payment-mastercard.png',
          'img/payment/payment-visa.png',
          'img/payment/payment-american-express.png',
          'img/payment/payment-naranja.png',
          'img/payment/payment-pagofacil.png',
          'img/payment/payment-rapipago.png',
          'img/payment/payment-2.png',
          'img/payment/payment-5.png',
          'img/payment/payment-btc.svg',
          'img/payment/payment-usdt.svg'
        ]
      }
    ],
    ctaLabel: 'Consulta gratis',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20un%20informe%20de%20dominio%20hist%C3%B3rico%20o%20actual.',
    domainConsultation: true
  },
  'denuncia-venta': {
    documentTitle: 'Denuncia de venta',
    kicker: '',
    title: 'Denuncia de venta',
    detailClass: 'gestoria-service-detail--denuncia',
    summary: 'La denuncia de venta es un tr&aacute;mite mediante el cual el titular informa al Registro del Automotor que ya no se encuentra en posesi&oacute;n del veh&iacute;culo.',
    highlights: [
      {
        label: 'Tiempo estimado',
        value: '24 horas h&aacute;biles'
      },
      {
        label: 'Modalidad',
        value: 'Tr&aacute;mite 100% online'
      },
      {
        label: 'Cobertura',
        value: 'Todo argentina'
      },
      {
        label: 'Beneficio clave',
        value: 'Te desvincula legalmente del veh&iacute;culo'
      }
    ],
    detailSections: [
      {
        title: '&iquest;Para qu&eacute; sirve?',
        items: [
          'Te desvincula legalmente del veh&iacute;culo.',
          'Evita futuras responsabilidades civiles.',
          'Te protege ante multas, infracciones o siniestros.'
        ],
        note: 'Una vez realizada, dej&aacute;s constancia formal de que el veh&iacute;culo fue entregado a un tercero.'
      },
      {
        title: '&iquest;Qu&eacute; datos necesito?',
        groups: [
          {
            title: 'Datos del comprador',
            items: [
              'Nombre y apellido completo',
              'DNI',
              'Domicilio'
            ]
          },
          {
            title: 'Datos del veh&iacute;culo',
            items: [
              'N&uacute;mero de dominio (patente)',
              'N&uacute;mero de chasis'
            ]
          },
          {
            title: 'Datos de la operaci&oacute;n',
            items: [
              'Lugar de entrega',
              'Fecha de entrega'
            ]
          }
        ]
      },
      {
        title: 'Importante',
        tone: 'warning',
        text: 'Es muy importante realizar este tr&aacute;mite de forma inmediata luego de entregar el veh&iacute;culo, para evitar cualquier tipo de responsabilidad futura.'
      },
      {
        title: '&iquest;Qui&eacute;n debe realizarla?',
        items: [
          'El tr&aacute;mite debe hacerlo el titular registral del veh&iacute;culo.'
        ],
        listStyle: 'checks'
      },
      {
        title: 'Costo',
        prices: [
          { label: 'Moto', value: '$50.000' },
          { label: 'Auto', value: '$70.000' }
        ]
      },
      {
        title: 'Medios de pago',
        paymentMethods: [
          { type: 'mercado-pago', label: 'Mercado Pago' },
          { type: 'transfer', label: 'Transferencia bancaria' },
          { type: 'card', label: 'Tarjetas' },
          { type: 'cash', label: 'Efectivo' }
        ]
      }
    ],
    ctaLabel: 'Iniciar tu tr&aacute;mite',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20una%20denuncia%20de%20venta.'
  },
  'cedula-titulo': {
    documentTitle: 'Cedula y titulo',
    kicker: '',
    title: 'C&eacute;dula y t&iacute;tulo',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Actualmente, el Registro del Automotor emite tanto la c&eacute;dula como el t&iacute;tulo del veh&iacute;culo en formato digital, facilitando su acceso y disponibilidad en todo momento.',
    highlights: [
      {
        label: 'Formato actual',
        value: 'Documentaci&oacute;n digital'
      },
      {
        label: 'Tr&aacute;mites disponibles',
        value: 'C&eacute;dula y t&iacute;tulo'
      },
      {
        label: 'Dato necesario',
        value: 'Dominio o patente'
      },
      {
        label: 'Uso clave',
        value: 'Circular legalmente'
      }
    ],
    detailSections: [
      {
        title: 'C&eacute;dula del automotor',
        text: 'La c&eacute;dula acredita la habilitaci&oacute;n para circular con el veh&iacute;culo.',
        items: [
          'Tenerla siempre disponible en la app <a href="https://www.argentina.gob.ar/aplicaciones/mi-argentina" target="_blank" rel="noopener" class="gestoria-service-link">Mi Argentina</a>.',
          'Solicitar la reposici&oacute;n de c&eacute;dula en caso de extrav&iacute;o o necesidad.'
        ],
        note: 'Es un documento indispensable para circular legalmente.'
      },
      {
        title: 'T&iacute;tulo del automotor',
        text: 'El t&iacute;tulo acredita la titularidad del veh&iacute;culo.',
        items: [
          'Solicitar duplicado de t&iacute;tulo.',
          'Validar el t&iacute;tulo digital todas las veces que sea necesario, con los c&oacute;digos correspondientes.',
          'Realizar la digitalizaci&oacute;n del t&iacute;tulo si cont&aacute;s con un t&iacute;tulo antiguo en papel.'
        ]
      },
      {
        title: '&iquest;Qu&eacute; necesit&aacute;s para realizar estos tr&aacute;mites?',
        items: [
          'DNI del titular.',
          'Datos del veh&iacute;culo, como dominio o patente.',
          'En algunos casos, c&oacute;digos de validaci&oacute;n del t&iacute;tulo digital.',
          'Informaci&oacute;n adicional seg&uacute;n el tipo de tr&aacute;mite, como reposici&oacute;n, duplicado o digitalizaci&oacute;n.'
        ]
      },
      {
        title: 'Importante',
        tone: 'warning',
        items: [
          'Circular sin inconvenientes.',
          'Realizar transferencias.',
          'Evitar problemas legales o administrativos.'
        ],
        note: 'Contar con la documentaci&oacute;n actualizada es fundamental.'
      }
    ],
    ctaLabel: 'Iniciar tu tr&aacute;mite',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20un%20tramite%20de%20cedula%20o%20titulo.'
  },
  'inscripcion-0km': {
    documentTitle: 'Inscripcion 0 km',
    kicker: '',
    title: 'Inscripci&oacute;n 0 km',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Realizamos la inscripci&oacute;n inicial de veh&iacute;culos 0 km de forma r&aacute;pida, segura y sin inconvenientes, para que puedas circular con toda la documentaci&oacute;n en regla.',
    highlights: [
      {
        label: 'Tiempo estimado',
        value: '24 horas h&aacute;biles'
      },
      {
        label: 'Dato clave',
        value: 'Dominio o patente'
      },
      {
        label: 'Resultado',
        value: 'Veh&iacute;culo registrado legalmente'
      }
    ],
    detailSections: [
      {
        title: '&iquest;Para qu&eacute; sirve?',
        items: [
          'Inscribir el veh&iacute;culo por primera vez en el Registro del Automotor.',
          'Obtener el dominio o patente.',
          'Dejar el veh&iacute;culo legalmente registrado a nombre del titular.'
        ],
        note: 'Es un paso obligatorio luego de la compra de un veh&iacute;culo nuevo.'
      },
      {
        title: '&iquest;Qu&eacute; necesito?',
        items: [
          'Factura de compra original.',
          'Formulario 01 emitido por el concesionario.',
          'Formulario 12, verificaci&oacute;n del veh&iacute;culo.',
          'DNI del titular.'
        ]
      },
      {
        title: '&iquest;Para qui&eacute;n es?',
        items: [
          'Personas que hayan adquirido un veh&iacute;culo 0 km y necesiten realizar su inscripci&oacute;n inicial.'
        ],
        listStyle: 'checks'
      },
      {
        title: '&iquest;Qu&eacute; se entrega?',
        items: [
          'T&iacute;tulo del automotor digital.',
          'C&eacute;dula del automotor digital.',
          'Chapas patente.',
          'Constancia de inscripci&oacute;n en el Registro.',
          'Constancia de VTV para autos, con per&iacute;odo de gracia de hasta 3 a&ntilde;os en veh&iacute;culos nuevos, seg&uacute;n normativa vigente.',
          'Constancia de RTO para motos, con per&iacute;odo de gracia de 3 a&ntilde;os.'
        ]
      },
      {
        title: 'Importante',
        tone: 'warning',
        items: [
          'Pueda circular legalmente.',
          'Est&eacute; correctamente registrado a nombre del titular.',
          'Evite futuros inconvenientes administrativos.'
        ],
        note: 'Realizar correctamente la inscripci&oacute;n garantiza que el veh&iacute;culo quede en regla.'
      },
      {
        title: 'Costo',
        text: 'El costo del tr&aacute;mite es variable, ya que depende del tipo y valor del veh&iacute;culo.'
      },
      {
        title: 'Medios de pago',
        paymentMethods: [
          { type: 'mercado-pago', label: 'Mercado Pago' },
          { type: 'transfer', label: 'Transferencia bancaria' },
          { type: 'card', label: 'Tarjetas' },
          { type: 'cash', label: 'Efectivo' }
        ]
      }
    ],
    ctaLabel: 'Iniciar tu tr&aacute;mite',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20una%20inscripcion%200%20km.'
  },
  'prendas-registrales': {
    documentTitle: 'Tramites registrables del automotor',
    kicker: '',
    title: 'Tr&aacute;mites registrables del automotor',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Realizamos todo tipo de tr&aacute;mites registrables ante el Registro de la Propiedad del Automotor, gestionados de manera correcta, &aacute;gil y segura.',
    highlights: [
      {
        label: 'Gesti&oacute;n',
        value: 'Formularios oficiales'
      },
      {
        label: 'Presentaci&oacute;n',
        value: 'Registro correspondiente'
      },
      {
        label: 'Prendas',
        value: 'Alta, baja y reinscripci&oacute;n'
      },
      {
        label: 'Vigencia',
        value: '5 a&ntilde;os'
      }
    ],
    detailSections: [
      {
        title: '&iquest;C&oacute;mo se realizan?',
        text: 'Los tr&aacute;mites registrables se gestionan mediante formularios tipo oficiales y presentaci&oacute;n formal ante el Registro del Automotor correspondiente.',
        items: [
          'Seg&uacute;n el domicilio del titular o del nuevo adquirente.',
          'Seg&uacute;n el registro donde se encuentra radicado el veh&iacute;culo.'
        ]
      },
      {
        title: 'Tipos de tr&aacute;mites',
        text: 'Entre los principales tr&aacute;mites que realizamos se encuentran:',
        items: [
          'Transferencias.',
          'Informes.',
          'Denuncias de venta.',
          'Inscripciones iniciales.',
          'C&eacute;dulas y t&iacute;tulos.',
          'Y otros tr&aacute;mites vinculados al automotor.'
        ]
      },
      {
        title: 'Prendas sobre el automotor',
        text: 'Tambi&eacute;n gestionamos todo lo relacionado con prendas o garant&iacute;as prendarias sobre veh&iacute;culos.',
        items: [
          'Inscripci&oacute;n de prenda cuando se financia un veh&iacute;culo.',
          'Levantamiento de prenda una vez cancelada la deuda.',
          'Reinscripci&oacute;n de prenda.'
        ]
      },
      {
        title: 'Vigencia de la prenda',
        items: [
          'Las prendas tienen una vigencia de 5 a&ntilde;os.',
          'Luego de ese plazo, pueden reinscribirse.',
          'Tambi&eacute;n puede gestionarse su cancelaci&oacute;n seg&uacute;n corresponda.'
        ],
        listStyle: 'checks'
      },
      {
        title: 'Importante',
        tone: 'warning',
        items: [
          'Depende de la situaci&oacute;n jur&iacute;dica del veh&iacute;culo.',
          'Puede requerir documentaci&oacute;n espec&iacute;fica.',
          'Es clave realizarlo correctamente para evitar inconvenientes legales.'
        ],
        note: 'Cada tr&aacute;mite debe evaluarse de manera particular antes de avanzar.'
      }
    ],
    ctaLabel: 'Iniciar tu tr&aacute;mite',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20prendas%20o%20tramites%20registrales.'
  },
  asesoramiento: {
    documentTitle: 'Asesoramiento personalizado',
    kicker: '',
    title: 'Asesoramiento personalizado',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Brindamos asesoramiento personalizado en tr&aacute;mites del automotor, adaptado a cada situaci&oacute;n en particular, para que tomes decisiones seguras y sin riesgos.',
    highlights: [
      {
        label: 'An&aacute;lisis',
        value: 'Caso 100% personalizado'
      },
      {
        label: 'Enfoque',
        value: 'Compra y venta segura'
      },
      {
        label: 'Modalidad',
        value: 'Online o presencial'
      },
      {
        label: 'Consulta',
        value: '$20.000'
      }
    ],
    detailSections: [
      {
        title: '&iquest;En qu&eacute; consiste?',
        text: 'El asesoramiento se basa en el an&aacute;lisis de tu caso espec&iacute;fico.',
        items: [
          'La documentaci&oacute;n disponible.',
          'La situaci&oacute;n legal del veh&iacute;culo.',
          'Qu&eacute; tr&aacute;mites son necesarios.',
          'Si es aconsejable o no una compra.',
          'C&oacute;mo realizar una venta correctamente.'
        ],
        note: 'Cada caso es distinto, por eso el an&aacute;lisis es 100% personalizado.'
      },
      {
        title: '&iquest;Qu&eacute; necesito?',
        items: [
          'Toda la documentaci&oacute;n disponible del veh&iacute;culo.',
          'O la mayor cantidad de informaci&oacute;n posible.'
        ],
        note: 'Esto nos permite evaluar con precisi&oacute;n y brindarte la mejor soluci&oacute;n.'
      },
      {
        title: '&iquest;Para qui&eacute;n es?',
        items: [
          'Personas que van a comprar un veh&iacute;culo.',
          'Personas que quieren vender y desvincularse correctamente.',
          'Quienes tengan dudas legales o administrativas.',
          'Personas que no saben qu&eacute; documentaci&oacute;n exigir o presentar.'
        ]
      },
      {
        title: 'Modalidad',
        items: [
          'Online.',
          'Presencial en oficina.'
        ],
        listStyle: 'checks'
      },
      {
        title: 'Importante',
        tone: 'warning',
        items: [
          'Evitar problemas legales.',
          'Ahorrarte dinero.',
          'Garantizar una operaci&oacute;n segura.'
        ],
        note: 'Un buen asesoramiento previo puede marcar la diferencia antes de avanzar.'
      },
      {
        title: 'Costo',
        prices: [
          { label: 'Consulta', value: '$20.000' }
        ]
      },
      {
        title: 'Medios de pago',
        paymentMethods: [
          { type: 'mercado-pago', label: 'Mercado Pago' },
          { type: 'transfer', label: 'Transferencia bancaria' },
          { type: 'card', label: 'Tarjetas' },
          { type: 'cash', label: 'Efectivo' }
        ]
      }
    ],
    ctaLabel: 'Agenda asesoramiento',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20necesito%20asesoramiento%20para%20saber%20que%20tramite%20del%20automotor%20corresponde%20en%20mi%20caso.'
  },
  'boleto-compra-venta': {
    documentTitle: 'Boleto de compra venta de inmuebles',
    kicker: '',
    title: 'Boleto de compra venta de inmuebles',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Redactamos y revisamos boletos de compra venta para dejar por escrito una operacion clara, ordenada y bien respaldada antes de avanzar a la escritura.',
    highlights: [
      {
        label: 'Operacion',
        value: 'Compra y venta'
      },
      {
        label: 'Incluye',
        value: 'Redaccion y revision'
      },
      {
        label: 'Apoyo clave',
        value: 'Sellado y respaldo'
      },
      {
        label: 'Objetivo',
        value: 'Operacion documentada'
      }
    ],
    detailSections: [
      {
        title: '&iquest;Que hacemos?',
        items: [
          'Redaccion del boleto con los datos de comprador, vendedor e inmueble.',
          'Revision de condiciones de pago, plazos y entrega.',
          'Acompanamiento con la documentacion necesaria para firmar con mayor claridad.',
          'Orientacion sobre el sellado y los pasos siguientes de la operacion.'
        ]
      },
      {
        title: 'Documentacion que suele hacer falta',
        items: [
          'DNI de las partes.',
          'Datos catastrales o identificacion del inmueble.',
          'Titulo, escritura o documentacion disponible del propietario.',
          'Condiciones comerciales acordadas: precio, forma de pago y plazos.'
        ]
      },
      {
        title: '&iquest;Para quien es?',
        items: [
          'Personas que van a comprar o vender un inmueble y necesitan dejar constancia escrita de la operacion con respaldo documental.'
        ],
        listStyle: 'checks'
      },
      {
        title: 'Importante',
        tone: 'warning',
        text: 'El boleto ordena la operacion y protege a las partes, pero debe estar bien redactado y alineado con la documentacion real del inmueble.'
      },
      {
        title: 'Medios de pago',
        paymentMethods: [
          { type: 'mercado-pago', label: 'Mercado Pago' },
          { type: 'transfer', label: 'Transferencia bancaria' },
          { type: 'card', label: 'Tarjetas' },
          { type: 'cash', label: 'Efectivo' }
        ]
      }
    ],
    ctaLabel: 'Consultar por WhatsApp',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20un%20boleto%20de%20compra%20venta%20de%20inmueble.'
  },
  'contratos-alquiler': {
    documentTitle: 'Contratos de alquiler',
    kicker: '',
    title: 'Contratos de alquiler',
    detailClass: 'gestoria-service-detail--informe',
    summary: 'Preparamos contratos de alquiler con clausulas claras, datos bien definidos y acompanamiento documental para propietarios e inquilinos.',
    highlights: [
      {
        label: 'Operacion',
        value: 'Alquileres'
      },
      {
        label: 'Incluye',
        value: 'Redaccion completa'
      },
      {
        label: 'Se define',
        value: 'Plazo y condiciones'
      },
      {
        label: 'Objetivo',
        value: 'Acuerdo claro'
      }
    ],
    detailSections: [
      {
        title: '&iquest;Que hacemos?',
        items: [
          'Redaccion del contrato de alquiler segun el acuerdo entre las partes.',
          'Ordenamiento de clausulas sobre plazo, monto, ajuste, deposito y obligaciones.',
          'Revision de datos del inmueble, locador, locatario y garantes si corresponde.',
          'Entrega del contrato listo para firma con una estructura clara y prolija.'
        ]
      },
      {
        title: 'Informacion necesaria',
        items: [
          'DNI de las partes.',
          'Datos del inmueble.',
          'Monto del alquiler y modalidad de pago.',
          'Plazo del contrato y condiciones especiales acordadas.',
          'Datos de garantes o respaldos adicionales si el caso lo requiere.'
        ]
      },
      {
        title: '&iquest;Para quien es?',
        items: [
          'Propietarios e inquilinos que buscan dejar por escrito condiciones claras para evitar confusiones futuras.'
        ],
        listStyle: 'checks'
      },
      {
        title: 'Importante',
        tone: 'warning',
        text: 'Un contrato bien armado ayuda a prevenir conflictos, ordenar obligaciones y dejar definidos los puntos sensibles desde el inicio.'
      },
      {
        title: 'Medios de pago',
        paymentMethods: [
          { type: 'mercado-pago', label: 'Mercado Pago' },
          { type: 'transfer', label: 'Transferencia bancaria' },
          { type: 'card', label: 'Tarjetas' },
          { type: 'cash', label: 'Efectivo' }
        ]
      }
    ],
    ctaLabel: 'Consultar por WhatsApp',
    ctaHref: 'https://wa.me/543743668039?text=Hola,%20quiero%20consultar%20por%20un%20contrato%20de%20alquiler.'
  }
};

const SERVICE_PAGE_METADATA = {
  transferencias: {
    pagePath: 'transferencia-automotor',
    metaTitle: 'Transferencia automotor en Jardín América | Gestoría Sonia',
    metaDescription: 'Transferencia de autos y motos en Jardín América, Misiones. Requisitos, costos orientativos y acompañamiento con Gestoría Sonia.',
    imagePath: 'img/services/transferencia-cover.jpg',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  'informe-dominio': {
    pagePath: 'informe-de-dominio',
    metaTitle: 'Informe de dominio automotor | Gestoría Sonia',
    metaDescription: 'Solicitá informe de dominio histórico o actual para autos y motos con Gestoría Sonia en Jardín América, Misiones.',
    imagePath: 'img/services/informes-cover.png',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  'denuncia-venta': {
    pagePath: 'denuncia-de-venta',
    metaTitle: 'Denuncia de venta del automotor | Gestoría Sonia',
    metaDescription: 'Realizá la denuncia de venta de tu auto o moto con acompañamiento local en Jardín América, Misiones.',
    imagePath: 'img/services/denuncia-venta-cover.png',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  'cedula-titulo': {
    pagePath: 'cedula-y-titulo-automotor',
    metaTitle: 'Cédula y título del automotor | Gestoría Sonia',
    metaDescription: 'Gestión de cédula, título, duplicados y documentación digital del automotor en Jardín América, Misiones.',
    imagePath: 'img/services/cedula-titulo-cover.png',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  'inscripcion-0km': {
    pagePath: 'inscripcion-0km',
    metaTitle: 'Inscripción 0 km | Gestoría Sonia',
    metaDescription: 'Patenta tu auto o moto 0 km con Gestoría Sonia. Inscripción inicial y documentación registral en Jardín América, Misiones.',
    imagePath: 'img/services/inscripcion-0km-cover.png',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  'prendas-registrales': {
    pagePath: 'prendas-y-tramites-registrales',
    metaTitle: 'Prendas y trámites registrales | Gestoría Sonia',
    metaDescription: 'Cancelaciones, regularizaciones y trámites registrales del automotor con seguimiento local en Jardín América, Misiones.',
    imagePath: 'img/services/prendas-registrales-cover.png',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  asesoramiento: {
    pagePath: 'asesoramiento-automotor',
    metaTitle: 'Asesoramiento de gestoría del automotor | Gestoría Sonia',
    metaDescription: 'Asesoramiento para compras, ventas y trámites del automotor con atención personalizada en Jardín América, Misiones.',
    imagePath: 'img/services/asesoramiento-cover.png',
    serviceHome: 'gestoria',
    serviceHomeLabel: 'Volver a servicios'
  },
  'boleto-compra-venta': {
    pagePath: 'boleto-compra-venta-inmuebles',
    metaTitle: 'Boleto de compra venta de inmuebles | Gestoría Sonia',
    metaDescription: 'Redacción, revisión y sellado de boletos de compra venta de inmuebles en Jardín América, Misiones.',
    imagePath: 'img/services/inmuebles-cover.jpg',
    serviceHome: 'gestoria-inmobiliaria',
    serviceHomeLabel: 'Volver a servicios inmobiliarios'
  },
  'contratos-alquiler': {
    pagePath: 'contratos-de-alquiler',
    metaTitle: 'Contratos de alquiler | Gestoría Sonia',
    metaDescription: 'Contratos de alquiler con redacción clara, condiciones bien definidas y respaldo documental en Jardín América, Misiones.',
    imagePath: 'img/services/inmuebles-cover.jpg',
    serviceHome: 'gestoria-inmobiliaria',
    serviceHomeLabel: 'Volver a servicios inmobiliarios'
  }
};

const SITE_ORIGIN = 'https://gestoriasonia.ar';
const GENERIC_SERVICE_TEMPLATES = new Set([
  'gestoria-servicio',
  'gestoria-inmobiliaria-servicio'
]);

const FEATURE_VISIBILITY = {
  'seguros-page': {
    title: 'Seguros no disponible',
    message: 'La seccion de seguros esta desactivada temporalmente desde el panel administrativo.',
    disabledTitle: 'Seguros no disponible | Gestoria Sonia',
    hrefPrefixes: ['seguros', 'liderar-seguros', 'cotizar-seguro'],
    pages: ['seguros', 'liderar-seguros', 'cotizar-seguro']
  },
  'mercado-page': {
    title: 'Mercado no disponible',
    message: 'La seccion de mercado esta desactivada temporalmente desde el panel administrativo.',
    disabledTitle: 'Mercado no disponible | Gestoria Sonia',
    hrefPrefixes: ['mercado', 'autos', 'inmuebles', 'terreno-lomas-de-jardin'],
    pages: ['mercado', 'autos', 'inmuebles', 'terreno-lomas-de-jardin'],
    homeSelectors: ['#home-mercado']
  }
};

function decodeHtmlEntities(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function getCurrentPageFile() {
  return window.location.pathname.split('/').pop() || '/';
}

function getResolvedService(serviceId) {
  if (!serviceId) return null;
  const service = GESTORIA_SERVICE_DETAILS[serviceId];
  if (!service) return null;
  return {
    ...service,
    ...(SERVICE_PAGE_METADATA[serviceId] || {})
  };
}

function setMetaContent(selector, value) {
  if (!value) return;
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', value);
}

function syncServicePageHead(service) {
  if (!service) return;

  const title = service.metaTitle || `${decodeHtmlEntities(service.documentTitle || service.title)} | Gestoria Sonia`;
  const description = service.metaDescription || decodeHtmlEntities(service.summary || '');
  const canonicalUrl = service.pagePath ? `${SITE_ORIGIN}/${service.pagePath}` : null;
  const imageUrl = service.imagePath ? `${SITE_ORIGIN}/${service.imagePath}` : null;
  const canonical = document.querySelector('link[rel="canonical"]');
  const descriptionMeta = document.querySelector('meta[name="description"]');

  document.title = title;
  if (canonical && canonicalUrl) canonical.href = canonicalUrl;
  if (descriptionMeta && description) descriptionMeta.setAttribute('content', description);

  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[property="og:image"]', imageUrl);
  setMetaContent('meta[property="og:image:alt"]', title);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:image"]', imageUrl);
}

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initContactForm();
  initQuienesReadMore();
  initGestoriaServiceGallery();
  initGestoriaServicePage();
  initAnalyticsTracking();
  await initPublicServiceVisibility();

  await Promise.all([
    initHomeDestacados(),
    initMarketplacePage(),
    initAutoPage(),
    initPropertyPage()
  ]);
});

function waLink(message) {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

function badgeLabel(state) {
  const map = {
    venta: ['badge-venta', 'En venta'],
    reserva: ['badge-reserva', 'Reservado'],
    vendido: ['badge-vendido', 'Vendido'],
    alquiler: ['badge-alquiler', 'En alquiler'],
    alquilado: ['badge-alquilado', 'Alquilado']
  };

  return map[state] || ['badge-venta', state || 'Disponible'];
}

function safeUrl(url, fallback = '#') {
  if (!url) return fallback;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('img/') ||
    url.startsWith('uploads/')
  ) {
    return url;
  }

  return fallback;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseIdFromQuery(key) {
  const params = new URLSearchParams(window.location.search);
  const value = Number.parseInt(params.get(key) || '', 10);
  return Number.isFinite(value) ? value : null;
}

async function fetchJson(url) {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error('No se pudo cargar la informacion.');
  }
  return response.json();
}

function loadAutos() {
  if (!cache.autosPromise) {
    cache.autosPromise = fetchJson('/api/autos').then(data => data.items || []);
  }
  return cache.autosPromise;
}

function loadProperties() {
  if (!cache.propertiesPromise) {
    cache.propertiesPromise = fetchJson('/api/inmuebles').then(data => data.items || []);
  }
  return cache.propertiesPromise;
}

function loadServiceSettings() {
  if (!cache.serviceSettingsPromise) {
    cache.serviceSettingsPromise = fetchJson('/api/services').then(data => data.items || []);
  }
  return cache.serviceSettingsPromise;
}

async function initPublicServiceVisibility() {
  const serviceCards = Array.from(document.querySelectorAll('[data-service-id]'));
  const detailMount = document.getElementById('gestoria-service-detail-mount');

  try {
    const services = await loadServiceSettings();
    const disabledIds = new Set(
      services
        .filter(service => !service.enabled)
        .map(service => service.id)
    );

    serviceCards.forEach(card => {
      card.hidden = disabledIds.has(card.dataset.serviceId);
    });
    renderServicesEmptyState(serviceCards);
    applyFeatureVisibility(disabledIds);

    if (detailMount) {
      const params = new URLSearchParams(window.location.search);
      const serviceId = detailMount.dataset.serviceId || params.get('servicio') || '';
      if (disabledIds.has(serviceId)) {
        renderDisabledServicePage(detailMount);
      }
    }
  } catch (error) {
    console.warn('No se pudo cargar la configuracion de servicios.', error);
  }
}

function applyFeatureVisibility(disabledIds) {
  Object.entries(FEATURE_VISIBILITY).forEach(([featureId, config]) => {
    if (!disabledIds.has(featureId)) return;

    hideFeatureLinks(config);
    hideFeatureHomeSections(config);

    if (config.pages.includes(getCurrentPageFile())) {
      renderDisabledFeaturePage(featureId, config);
    }
  });
}

function hideFeatureLinks(config) {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    const normalizedHref = href.replace(/^\.\//, '');
    const shouldHide = config.hrefPrefixes.some(prefix =>
      normalizedHref === prefix ||
      normalizedHref.startsWith(`${prefix}?`) ||
      normalizedHref.startsWith(`${prefix}#`)
    );

    if (!shouldHide) return;

    const navItem = link.closest('li');
    const serviceCard = link.classList.contains('service-card') ? link : null;
    const sectionLink = link.classList.contains('section-link') ? link : null;
    (navItem || serviceCard || sectionLink || link).hidden = true;
  });
}

function hideFeatureHomeSections(config) {
  (config.homeSelectors || []).forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      const section = element.closest('section');
      (section || element).hidden = true;
    });
  });
}

function renderDisabledFeaturePage(featureId, config) {
  document.body.dataset.disabledFeature = featureId;
  document.title = config.disabledTitle || `${config.title} | Gestoria Sonia`;

  const nav = document.querySelector('.navbar');
  const footer = document.querySelector('.footer');
  Array.from(document.body.children).forEach(child => {
    if (
      child === nav ||
      child === footer ||
      child.classList.contains('wa-float') ||
      child.tagName === 'SCRIPT'
    ) {
      return;
    }
    child.hidden = true;
  });

  const existing = document.querySelector('[data-disabled-feature-page]');
  if (existing) existing.remove();

  const section = document.createElement('section');
  section.className = 'section page-empty-shell';
  section.setAttribute('data-disabled-feature-page', featureId);
  section.innerHTML = `
    <div class="auto-detail-empty">
      <p class="breadcrumb"><a href="/">Inicio</a> &rsaquo; <span>No disponible</span></p>
      <h1>${config.title}</h1>
      <p>${config.message}</p>
      <a href="/" class="btn btn-dark">Volver al inicio</a>
    </div>
  `;

  if (nav) {
    nav.insertAdjacentElement('afterend', section);
  } else {
    document.body.prepend(section);
  }
}

function renderServicesEmptyState(serviceCards) {
  const grid = document.querySelector('.gestoria-services-grid');
  if (!grid || !serviceCards.length) return;

  grid.querySelector('[data-services-empty-state]')?.remove();
  const hasVisibleServices = serviceCards.some(card => !card.hidden);
  if (hasVisibleServices) return;

  grid.insertAdjacentHTML(
    'beforeend',
    `
      <div class="services-empty-state" data-services-empty-state>
        <h3>Servicios no disponibles</h3>
        <p>Por el momento no hay servicios publicados en esta seccion.</p>
      </div>
    `
  );
}

function renderDisabledServicePage(mount) {
  const home = mount.dataset.serviceHome || 'gestoria';
  const label = mount.dataset.serviceHomeLabel || 'Volver a servicios';
  const crumbCurrent = document.getElementById('gestoria-service-crumb-current');
  const backLink = document.querySelector('.gestoria-service-backlink');

  document.title = 'Servicio no disponible | Gestoria Sonia';
  if (crumbCurrent) crumbCurrent.textContent = 'Servicio no disponible';
  if (backLink) {
    backLink.href = home;
    backLink.textContent = label;
  }

  mount.innerHTML = `
    <section class="gestoria-service-page-error">
      <h2>Servicio no disponible</h2>
      <p>Este servicio esta desactivado temporalmente desde el panel administrativo.</p>
      <a href="${home}" class="btn btn-dark">${label}</a>
    </section>
  `;
}

function renderCarCard(auto) {
  const [badgeClass, badgeText] = badgeLabel(auto.status);
  const specs = [auto.year, auto.fuel, auto.transmission].filter(Boolean).join(' · ');

  return `
    <article class="car-card" data-tipo="${escapeHtml(auto.vehicleType)}" data-estado="${escapeHtml(auto.status)}" data-anio="${escapeHtml(auto.year)}">
      <a href="autos?auto=${auto.id}" class="car-card-link" aria-label="Ver ${escapeHtml(auto.title)}">
        <div class="car-card-img">
          <img src="${escapeHtml(safeUrl(auto.coverImage || auto.galleryImages?.[0] || 'img/services/autos-cover.jpg'))}" alt="${escapeHtml(auto.title)}" loading="lazy">
          <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        </div>
        <div class="car-card-body">
          <h3>${escapeHtml(auto.title)}</h3>
          <p class="car-card-sub">${escapeHtml(specs || auto.version || '')}</p>
          <p class="car-card-price">${escapeHtml(auto.price)} <small>${escapeHtml(auto.currency || '')}</small></p>
        </div>
      </a>
    </article>
  `;
}

function renderPropertyCard(property) {
  const [badgeClass, badgeText] = badgeLabel(property.status || property.operation);
  const features = [
    property.propertyType,
    property.dimensions,
    property.landAreaM2 ? `${property.landAreaM2} m2` : '',
    property.bedrooms ? `${property.bedrooms} dorm.` : ''
  ].filter(Boolean).map(item => `<span class="prop-feat">${escapeHtml(item)}</span>`).join('');

  return `
    <article class="prop-card" data-tipo="${escapeHtml(property.propertyType)}" data-operacion="${escapeHtml(property.operation)}">
      <a href="inmuebles?inmueble=${property.id}" class="prop-card-image-link" aria-label="Ver ${escapeHtml(property.title)}">
        <div class="prop-card-img">
          <img src="${escapeHtml(safeUrl(property.coverImage || property.galleryImages?.[0] || 'img/services/inmuebles-cover.jpg'))}" alt="${escapeHtml(property.title)}" loading="lazy">
          <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        </div>
      </a>
      <div class="prop-card-body">
        <h3>${escapeHtml(property.title)}</h3>
        <p class="prop-location">${escapeHtml(property.location || '')}</p>
        <div class="prop-features">${features}</div>
        <p class="prop-card-price">${escapeHtml(property.price)} <small>${escapeHtml(property.currency || '')}</small></p>
      </div>
    </article>
  `;
}

function formatVehicleType(type) {
  const map = {
    pickup: 'Pickup',
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    utilitario: 'Utilitario'
  };

  return map[type] || 'Auto';
}

function formatPropertyType(type) {
  const map = {
    casa: 'Casa',
    departamento: 'Departamento',
    lote: 'Lote',
    local: 'Local',
    campo: 'Campo'
  };

  return map[type] || 'Inmueble';
}

function getMarketTimestamp(item) {
  const raw = item.createdAt || item.updatedAt || '';
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function buildMarketItems(autos, properties) {
  const autoItems = autos.map(auto => {
    const [badgeClass, badgeText] = badgeLabel(auto.status);

    return {
      id: auto.id,
      kind: 'auto',
      title: auto.title || [auto.brand, auto.model].filter(Boolean).join(' ') || 'Vehiculo',
      href: `autos?auto=${auto.id}`,
      image: safeUrl(auto.coverImage || auto.galleryImages?.[0] || 'img/services/autos-cover.jpg'),
      badgeClass,
      badgeText,
      categoryLabel: 'Auto',
      typeLabel: formatVehicleType(auto.vehicleType),
      location: auto.location || 'Jardin America, Misiones',
      price: auto.price || 'Consultar precio',
      currency: auto.currency || '',
      meta: [
        auto.year ? String(auto.year) : '',
        auto.fuel || '',
        auto.km ? formatAutoKm(auto.km) : ''
      ].filter(Boolean),
      filterType: 'auto',
      filterOperation: auto.status === 'alquiler' ? 'alquiler' : 'venta',
      featured: Boolean(auto.featured),
      createdAt: auto.createdAt,
      updatedAt: auto.updatedAt
    };
  });

  const propertyItems = properties.map(property => {
    const [badgeClass, badgeText] = badgeLabel(property.status || property.operation);
    const areaLabel =
      property.landAreaM2 ? `${property.landAreaM2} m2`
        : property.areaM2 ? `${property.areaM2} m2`
          : '';

    return {
      id: property.id,
      kind: 'inmueble',
      title: property.title || 'Propiedad',
      href: `inmuebles?inmueble=${property.id}`,
      image: safeUrl(property.coverImage || property.galleryImages?.[0] || 'img/services/inmuebles-cover.jpg'),
      badgeClass,
      badgeText,
      categoryLabel: 'Inmueble',
      typeLabel: formatPropertyType(property.propertyType),
      location: property.location || 'Jardin America, Misiones',
      price: property.price || 'Consultar precio',
      currency: property.currency || '',
      meta: [
        formatPropertyType(property.propertyType),
        property.operation === 'alquiler' ? 'Alquiler' : 'Venta',
        areaLabel || (property.bedrooms ? `${property.bedrooms} dorm.` : '')
      ].filter(Boolean),
      filterType: 'inmueble',
      filterOperation: property.operation || (property.status === 'alquiler' ? 'alquiler' : 'venta'),
      featured: Boolean(property.featured),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    };
  });

  return [...autoItems, ...propertyItems].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    return getMarketTimestamp(right) - getMarketTimestamp(left);
  });
}

function renderMarketCard(item) {
  return `
    <article class="market-card" data-market-type="${escapeHtml(item.filterType)}" data-market-operation="${escapeHtml(item.filterOperation)}">
      <a href="${escapeHtml(item.href)}" class="market-card-link" aria-label="Ver ${escapeHtml(item.title)}">
        <div class="market-card-media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <span class="badge ${escapeHtml(item.badgeClass)}">${escapeHtml(item.badgeText)}</span>
          <span class="market-card-kind">${escapeHtml(item.categoryLabel)}</span>
        </div>
        <div class="market-card-body">
          <p class="market-card-eyebrow">Mercado · ${escapeHtml(item.typeLabel)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="market-card-location">${escapeHtml(item.location)}</p>
          <div class="market-card-meta">
            ${item.meta.map(detail => `<span>${escapeHtml(detail)}</span>`).join('')}
          </div>
          <p class="market-card-price">${escapeHtml(item.price)}${item.currency ? ` <small>${escapeHtml(item.currency)}</small>` : ''}</p>
        </div>
      </a>
    </article>
  `;
}

function formatAutoKm(value) {
  if (value === null || value === undefined || value === '') {
    return 'Kilometraje no informado';
  }

  const raw = String(value).trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return raw.toLowerCase().includes('km') ? raw : `${raw} km`;
  }

  return `${Number.parseInt(digits, 10).toLocaleString('es-AR')} km`;
}

function formatPublishedTime(value) {
  if (!value) return 'Publicado recientemente';

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return 'Publicado recientemente';

  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startCreated = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
  const diffDays = Math.max(0, Math.floor((startToday - startCreated) / 86400000));

  if (diffDays === 0) return 'Publicado hoy';
  if (diffDays === 1) return 'Publicado hace 1 dia';
  return `Publicado hace ${diffDays} dias`;
}

function renderFeatureRows(rows) {
  return rows
    .map(
      ([label, value]) => `
        <tr class="auto-feature-row">
          <th scope="row">${escapeHtml(label)}</th>
          <td>${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');
}

function renderFeatureIcon(type) {
  const icons = {
    paint: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/color.svg',
    fuel: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/fuel_type.svg',
    door: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/doors.svg',
    engine: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/engine.svg'
  };

  return icons[type] || icons.engine;
}

function renderAutoDetailPage(auto) {
  const gallery = auto.galleryImages && auto.galleryImages.length
    ? auto.galleryImages
    : [auto.coverImage].filter(Boolean);
  const [, badgeText] = badgeLabel(auto.status);
  const title = auto.title || [auto.brand, auto.model].filter(Boolean).join(' ') || 'Vehiculo';
  const highlights = (auto.highlights || []).length
    ? auto.highlights
    : ['Publicacion activa', 'Consulta directa por WhatsApp'];
  const primaryRows = [
    ['Marca', auto.brand],
    ['Modelo', auto.model],
    ['Version', auto.version],
    ['Anio', auto.year],
    ['Color', auto.color],
    ['Tipo de combustible', auto.fuel],
    ['Puertas', auto.doors],
    ['Motor', auto.engine],
    ['Kilometros', formatAutoKm(auto.km)]
  ].filter(([, value]) => value);
  const generalRows = [
    ['Caja', auto.transmission],
    ['Direccion', auto.steering],
    ['Traccion', auto.traction],
    ['Cabina', auto.cabin],
    ['Ubicacion', auto.location]
  ].filter(([, value]) => value);
  const purchaseRows = ((auto.highlights || []).length
    ? auto.highlights.slice(0, 4).map(item => [item, 'Si'])
    : [['Estado de la publicacion', badgeText]])
    .filter(([, value]) => value);
  const summarySpecs = [
    auto.year ? String(auto.year) : 'Ano no informado',
    formatAutoKm(auto.km),
    formatPublishedTime(auto.createdAt)
  ];
  const askLink = waLink(`Hola, tengo una consulta sobre el vehiculo ${title}.`);
  const whatsappLink = waLink(`Hola, me interesa el vehiculo ${title}. Quiero mas informacion.`);

  return `
    <section class="auto-detail-page">
      <div class="auto-detail-topbar">
        <p class="breadcrumb"><a href="/">Inicio</a> › <a href="mercado">Mercado</a> › <span>${escapeHtml(title)}</span></p>
        <a href="mercado" class="auto-back-link" data-back-link aria-label="Volver">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.4 11H20a1 1 0 1 1 0 2h-9.6l4.3 4.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z" fill="currentColor"/></svg>
        </a>
      </div>

      <div class="auto-market-layout">
        <div class="auto-market-main">
          <div class="auto-gallery-shell">
            <div class="auto-gallery-rail">
              ${gallery.map((photo, index) => `
                <button type="button" class="auto-gallery-thumb${index === 0 ? ' is-active' : ''}" data-thumb-image="${escapeHtml(safeUrl(photo))}" aria-label="Ver foto ${index + 1}">
                  <img src="${escapeHtml(safeUrl(photo))}" alt="${escapeHtml(title)} foto ${index + 1}" loading="lazy">
                </button>
              `).join('')}
            </div>
            <div class="auto-gallery-main">
              <img src="${escapeHtml(safeUrl(gallery[0] || 'img/services/autos-cover.jpg'))}" alt="${escapeHtml(title)}" data-main-image>
            </div>
          </div>
        </div>

        <aside class="auto-market-sidebar">
          <div class="auto-market-card">
            <div class="auto-market-meta">
              ${summarySpecs.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
            </div>
            <span class="auto-detail-badge">${escapeHtml(badgeText)}</span>
            <h1>${escapeHtml(title)}</h1>
            ${auto.location ? `<p class="auto-market-location">${escapeHtml(auto.location)}</p>` : ''}
            <p class="auto-detail-price-main">${escapeHtml(auto.price)}</p>
            <ul class="auto-detail-checks">
              ${highlights.map(item => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>${escapeHtml(item)}</span></li>`).join('')}
            </ul>
            <div class="auto-market-actions">
              <a href="${askLink}" target="_blank" rel="noopener" class="auto-market-btn auto-market-btn--ask">Preguntar</a>
              <a href="${whatsappLink}" target="_blank" rel="noopener" class="auto-market-btn auto-market-btn--wa">WhatsApp</a>
            </div>
          </div>
        </aside>
      </div>

      <section class="auto-product-section">
        <div class="auto-product-header"><h2>Caracteristicas del producto</h2></div>

        <div class="auto-feature-highlights">
          ${[
            { icon: 'paint', label: 'Color', value: auto.color || 'No informado' },
            { icon: 'fuel', label: 'Tipo de combustible', value: auto.fuel || 'No informado' },
            { icon: 'door', label: 'Puertas', value: auto.doors || 'No informado' },
            { icon: 'engine', label: 'Motor', value: auto.engine || 'No informado' }
          ].map(feature => `
            <article class="auto-highlight-item">
              <span class="auto-highlight-icon" aria-hidden="true">
                <img src="${renderFeatureIcon(feature.icon)}" alt="" loading="lazy">
              </span>
              <div class="auto-highlight-copy">
                <p><span>${escapeHtml(feature.label)}:</span> <strong>${escapeHtml(feature.value)}</strong></p>
              </div>
            </article>
          `).join('')}
        </div>

        <div class="auto-feature-groups">
          <div class="auto-feature-column">
            <section class="auto-feature-group">
              <h3>Principales</h3>
              <table class="auto-feature-table"><tbody>${renderFeatureRows(primaryRows)}</tbody></table>
            </section>
          </div>

          <div class="auto-feature-column auto-feature-column-stack">
            <section class="auto-feature-group">
              <h3>Informacion general</h3>
              <table class="auto-feature-table"><tbody>${renderFeatureRows(generalRows)}</tbody></table>
            </section>

            <section class="auto-feature-group">
              <h3>Condiciones de compra</h3>
              <table class="auto-feature-table"><tbody>${renderFeatureRows(purchaseRows)}</tbody></table>
            </section>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderPropertyDetailPage(property) {
  const gallery = property.galleryImages && property.galleryImages.length
    ? property.galleryImages
    : [property.coverImage].filter(Boolean);
  const highlights = (property.highlights || []).length
    ? property.highlights
    : ['Publicacion activa'];
  const rows = [
    ['Operacion', property.operation],
    ['Estado', badgeLabel(property.status || property.operation)[1]],
    ['Tipo', property.propertyType],
    ['Ubicacion', property.location],
    ['Dormitorios', property.bedrooms],
    ['Banos', property.bathrooms],
    ['Metros cubiertos', property.areaM2 ? `${property.areaM2} m2` : ''],
    ['Metros de terreno', property.landAreaM2 ? `${property.landAreaM2} m2` : ''],
    ['Medidas', property.dimensions],
    ['Acceso', property.access],
    ['Infraestructura', property.infrastructure],
    ['Esquina', property.corner ? 'Si' : '']
  ].filter(([, value]) => value);

  return `
    <section class="property-detail-section">
      <div class="page-hero" style="margin-bottom:32px;">
        <div>
          <p class="breadcrumb"><a href="/">Inicio</a> › <a href="mercado">Mercado</a> › <span>${escapeHtml(property.title)}</span></p>
          <h1>${escapeHtml(property.title)}</h1>
          <p>${escapeHtml([property.location, property.price].filter(Boolean).join(' · '))}</p>
        </div>
        <a href="${waLink(`Hola, me interesa el inmueble ${property.title}. Quiero mas informacion.`)}" target="_blank" rel="noopener" class="btn btn-primary">Consultar por WhatsApp</a>
      </div>

      <div class="property-detail-grid">
        <div class="property-main">
          <div class="detail-gallery">${gallery.map(photo => `<a href="${escapeHtml(safeUrl(photo))}" target="_blank" rel="noopener" class="detail-gallery-item"><img src="${escapeHtml(safeUrl(photo))}" alt="${escapeHtml(property.title)}" loading="lazy"></a>`).join('')}</div>
          <div class="property-summary" style="margin-top:24px;">
            <span class="detail-pill">${escapeHtml(badgeLabel(property.status || property.operation)[1])}</span>
            <h2>Descripcion</h2>
            <p class="property-lead">${escapeHtml(property.description)}</p>
            <div class="property-highlight-grid">${highlights.map(item => `<div class="property-highlight-card"><strong>${escapeHtml(item)}</strong></div>`).join('')}</div>
          </div>
        </div>

        <aside class="property-sidebar">
          <div class="property-sticky">
            <div class="property-price-card">
              <p class="property-price-label">Precio</p>
              <strong class="property-price-value">${escapeHtml(property.price)}</strong>
              <p>Consultas directas por WhatsApp para coordinar visita o pedir documentacion.</p>
              <div class="property-card-actions">
                <a href="${waLink(`Hola, quiero consultar por el inmueble ${property.title}.`)}" target="_blank" rel="noopener" class="btn btn-primary">Consultar ahora</a>
                ${property.mapUrl ? `<a href="${escapeHtml(safeUrl(property.mapUrl))}" target="_blank" rel="noopener" class="btn btn-dark">Abrir ubicacion</a>` : ''}
              </div>
            </div>
            <div class="property-tech-card">
              <h3>Ficha tecnica</h3>
              <dl class="tech-list">${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

async function initHomeDestacados() {
  if (document.body.dataset.disabledFeature === 'mercado-page') return;

  const autosMount = document.getElementById('home-autos');
  const propertiesMount = document.getElementById('home-inmuebles');
  const marketplaceMount = document.getElementById('home-mercado');
  if (!autosMount && !propertiesMount && !marketplaceMount) return;

  try {
    const [autos, properties] = await Promise.all([loadAutos(), loadProperties()]);
    const marketItems = buildMarketItems(autos, properties);
    if (autosMount) {
      const featuredAutos = autos.filter(item => item.featured).slice(0, 3);
      autosMount.innerHTML = (featuredAutos.length ? featuredAutos : autos.slice(0, 3)).map(renderCarCard).join('');
    }
    if (propertiesMount) {
      const featuredProperties = properties.filter(item => item.featured).slice(0, 3);
      propertiesMount.innerHTML = (featuredProperties.length ? featuredProperties : properties.slice(0, 3)).map(renderPropertyCard).join('');
    }
    if (marketplaceMount) {
      const featuredMarket = marketItems.filter(item => item.featured).slice(0, 4);
      marketplaceMount.innerHTML = (featuredMarket.length ? featuredMarket : marketItems.slice(0, 4)).map(renderMarketCard).join('');
    }
  } catch {
    if (autosMount) autosMount.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los autos.</p>';
    if (propertiesMount) propertiesMount.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los inmuebles.</p>';
    if (marketplaceMount) marketplaceMount.innerHTML = '<p style="color:var(--gray-500);">No se pudo cargar el mercado.</p>';
  }
}

async function initMarketplacePage() {
  if (document.body.dataset.disabledFeature === 'mercado-page') return;

  const grid = document.getElementById('mercado-grid');
  if (!grid) return;

  try {
    const [autos, properties] = await Promise.all([loadAutos(), loadProperties()]);
    const items = buildMarketItems(autos, properties);
    const params = new URLSearchParams(window.location.search);
    const typeSelect = document.getElementById('filtro-mercado-tipo');
    const operationSelect = document.getElementById('filtro-mercado-operacion');
    const count = document.getElementById('mercado-count');
    const requestedType = params.get('tipo') || '';
    const requestedOperation = params.get('operacion') || '';

    if (typeSelect && ['auto', 'inmueble'].includes(requestedType)) {
      typeSelect.value = requestedType;
    }

    if (operationSelect && ['venta', 'alquiler'].includes(requestedOperation)) {
      operationSelect.value = requestedOperation;
    }

    const renderFilteredMarket = () => {
      const selectedType = typeSelect?.value || '';
      const selectedOperation = operationSelect?.value || '';
      const filtered = items.filter(item => {
        if (selectedType && item.filterType !== selectedType) return false;
        if (selectedOperation && item.filterOperation !== selectedOperation) return false;
        return true;
      });

      grid.innerHTML = filtered.length
        ? filtered.map(renderMarketCard).join('')
        : '<div class="no-results"><p>No se encontraron publicaciones para esos filtros.</p></div>';

      if (count) {
        count.textContent = `${filtered.length} publicacion${filtered.length === 1 ? '' : 'es'}`;
      }
    };

    [typeSelect, operationSelect].forEach(select => {
      select?.addEventListener('change', renderFilteredMarket);
    });

    renderFilteredMarket();
  } catch {
    grid.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar las publicaciones del mercado.</p>';
  }
}

async function initAutoPage() {
  if (document.body.dataset.disabledFeature === 'mercado-page') return;

  const grid = document.getElementById('autos-grid');
  const detailMount = document.getElementById('auto-detail-view');
  if (!grid && !detailMount) return;

  try {
    const autos = await loadAutos();
    const requestedId = parseIdFromQuery('auto');

    if (requestedId && detailMount) {
      const auto = autos.find(item => item.id === requestedId);
      document.querySelectorAll('[data-autos-list-view]').forEach(section => { section.hidden = true; });
      detailMount.hidden = false;
      detailMount.innerHTML = auto ? renderAutoDetailPage(auto) : '<section class="auto-detail-empty"><h1>Vehiculo no encontrado</h1><p>La publicacion ya no existe.</p><a href="mercado" class="btn btn-dark">Volver al mercado</a></section>';
      bindDetailGallery();
      return;
    }

    if (detailMount) {
      detailMount.hidden = true;
      detailMount.innerHTML = '';
    }

    if (!grid) return;
    const renderFilteredAutos = () => {
      const type = document.getElementById('filtro-tipo-auto')?.value || '';
      const status = document.getElementById('filtro-estado-auto')?.value || '';
      const year = Number.parseInt(document.getElementById('filtro-anio-auto')?.value || '', 10);
      const filtered = autos.filter(auto => {
        if (type && auto.vehicleType !== type) return false;
        if (status && auto.status !== status) return false;
        if (Number.isFinite(year) && auto.year && auto.year < year) return false;
        return true;
      });
      grid.innerHTML = filtered.length ? filtered.map(renderCarCard).join('') : '<div class="no-results"><p>No se encontraron vehiculos con esos filtros.</p></div>';
      const counter = document.getElementById('autos-count');
      if (counter) counter.textContent = `${filtered.length} vehiculo${filtered.length === 1 ? '' : 's'}`;
    };

    ['filtro-tipo-auto', 'filtro-estado-auto', 'filtro-anio-auto'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', renderFilteredAutos);
    });
    renderFilteredAutos();
  } catch {
    if (grid) grid.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los vehiculos.</p>';
  }
}

async function initPropertyPage() {
  if (document.body.dataset.disabledFeature === 'mercado-page') return;

  const grid = document.getElementById('inmuebles-grid');
  const detailMount = document.getElementById('inmueble-detail-view');
  if (!grid && !detailMount) return;

  try {
    const properties = await loadProperties();
    const requestedId = parseIdFromQuery('inmueble');

    if (requestedId && detailMount) {
      const property = properties.find(item => item.id === requestedId);
      document.querySelectorAll('[data-inmuebles-list-view]').forEach(section => { section.hidden = true; });
      detailMount.hidden = false;
      detailMount.innerHTML = property ? renderPropertyDetailPage(property) : '<section class="auto-detail-empty"><h1>Inmueble no encontrado</h1><p>La publicacion ya no existe.</p><a href="mercado" class="btn btn-dark">Volver al mercado</a></section>';
      return;
    }

    if (detailMount) {
      detailMount.hidden = true;
      detailMount.innerHTML = '';
    }

    if (!grid) return;
    const renderFilteredProperties = operationOverride => {
      const operation =
        operationOverride ?? (document.getElementById('filtro-operacion')?.value || '');
      const type = document.getElementById('filtro-tipo-prop')?.value || '';
      const filtered = properties.filter(property => {
        if (operation && property.operation !== operation) return false;
        if (type && property.propertyType !== type) return false;
        return true;
      });
      grid.innerHTML = filtered.length ? filtered.map(renderPropertyCard).join('') : '<div class="no-results"><p>No se encontraron propiedades con esos filtros.</p></div>';
      const counter = document.getElementById('inmuebles-count');
      if (counter) counter.textContent = `${filtered.length} propiedad${filtered.length === 1 ? '' : 'es'}`;
    };

    document.querySelectorAll('[data-property-tab]').forEach(button => {
      button.addEventListener('click', () => {
        updatePropertyTabStyles(button);
        const select = document.getElementById('filtro-operacion');
        if (select) select.value = button.dataset.propertyTab;
        renderFilteredProperties(button.dataset.propertyTab);
      });
    });

    ['filtro-operacion', 'filtro-tipo-prop'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => renderFilteredProperties());
    });
    const activeTab = document.querySelector('[data-property-tab].active') || document.querySelector('[data-property-tab=""]');
    if (activeTab) updatePropertyTabStyles(activeTab);
    renderFilteredProperties();
  } catch {
    if (grid) grid.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los inmuebles.</p>';
  }
}

function bindDetailGallery() {
  const mainImage = document.querySelector('[data-main-image]');
  const thumbButtons = Array.from(document.querySelectorAll('[data-thumb-image]'));
  thumbButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!mainImage) return;
      mainImage.src = button.dataset.thumbImage;
      thumbButtons.forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });

  document.querySelector('[data-back-link]')?.addEventListener('click', event => {
    if (window.history.length <= 1) return;
    event.preventDefault();
    window.history.back();
  });
}

function initGestoriaServiceGallery() {
  const stage = document.querySelector('[data-gestoria-service-stage]');
  const emptyState = document.querySelector('[data-gestoria-service-empty]');
  const triggers = Array.from(document.querySelectorAll('[data-gestoria-service-trigger]'));
  const panels = Array.from(document.querySelectorAll('[data-gestoria-service-panel]'));

  if (!stage || !emptyState || !triggers.length || !panels.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeServiceId = '';

  const scrollStageIntoView = () => {
    const bounds = stage.getBoundingClientRect();
    const isVisibleEnough = bounds.top >= 100 && bounds.top <= window.innerHeight * 0.45;
    if (isVisibleEnough) return;

    stage.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  };

  const setActiveService = serviceId => {
    activeServiceId = serviceId || '';

    triggers.forEach(trigger => {
      const isActive = trigger.dataset.gestoriaServiceTrigger === activeServiceId;
      trigger.classList.toggle('is-active', isActive);
      trigger.setAttribute('aria-expanded', String(isActive));
    });

    panels.forEach(panel => {
      panel.hidden = panel.dataset.gestoriaServicePanel !== activeServiceId;
    });

    emptyState.hidden = Boolean(activeServiceId);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetServiceId = trigger.dataset.gestoriaServiceTrigger || '';
      const nextServiceId = activeServiceId === targetServiceId ? '' : targetServiceId;
      setActiveService(nextServiceId);
      if (nextServiceId) {
        requestAnimationFrame(scrollStageIntoView);
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('servicio') || '';
  const requestedPanelExists = panels.some(panel => panel.dataset.gestoriaServicePanel === requestedService);

  setActiveService(requestedPanelExists ? requestedService : '');
}

function initGestoriaServicePage() {
  const mount = document.getElementById('gestoria-service-detail-mount');
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const currentPage = getCurrentPageFile();
  const requestedServiceId = mount.dataset.serviceId || params.get('servicio') || '';
  const service = getResolvedService(requestedServiceId);
  const crumbCurrent = document.getElementById('gestoria-service-crumb-current');
  const backLink = document.querySelector('.gestoria-service-backlink');
  const fallbackHome =
    mount.dataset.serviceHome ||
    (currentPage === 'gestoria-inmobiliaria-servicio'
      ? 'gestoria-inmobiliaria'
      : 'gestoria');
  const fallbackHomeLabel =
    mount.dataset.serviceHomeLabel ||
    (fallbackHome === 'gestoria-inmobiliaria'
      ? 'Volver a servicios inmobiliarios'
      : 'Volver a servicios');

  if (service?.pagePath && params.get('servicio') && GENERIC_SERVICE_TEMPLATES.has(currentPage)) {
    window.location.replace(service.pagePath);
    return;
  }

  if (!service) {
    if (crumbCurrent) crumbCurrent.textContent = 'No encontrado';
    document.title = 'Servicio no encontrado | Gestoria Sonia';
    if (backLink) {
      backLink.href = fallbackHome;
      backLink.textContent = fallbackHomeLabel;
    }
    mount.innerHTML = `
      <section class="gestoria-service-page-error">
        <h2>Servicio no encontrado</h2>
        <p>El enlace no coincide con un tramite disponible. Volve a la galeria y elegi el servicio que queres revisar.</p>
        <a href="${fallbackHome}" class="btn btn-dark">${fallbackHomeLabel}</a>
      </section>
    `;
    return;
  }

  if (backLink) {
    backLink.href = service.serviceHome || fallbackHome;
    backLink.textContent = service.serviceHomeLabel || fallbackHomeLabel;
  }
  if (crumbCurrent) crumbCurrent.innerHTML = service.title;
  syncServicePageHead(service);
  mount.innerHTML = renderGestoriaServiceDetail(service);
  initGestoriaServiceCalculatorReveal(mount);
  initGestoriaPaymentToggles(mount);
  initDomainConsultationModal(mount);
}

function renderGestoriaServiceDetail(service) {
  const includeMarkup = service.include
    ? `<p class="gestoria-service-include"><strong>Incluye:</strong> ${service.include}</p>`
    : '';
  const eyebrowMarkup = service.kicker ? `<span class="gestoria-service-eyebrow">${service.kicker}</span>` : '';
  const highlightsMarkup = service.highlights?.length
    ? `
      <div class="gestoria-service-highlight-grid">
        ${service.highlights.map(item => `
          <div class="gestoria-service-highlight-card">
            ${renderGestoriaServiceHighlightIcon(item)}
            <span class="gestoria-service-highlight-label">${item.label}</span>
            <strong class="gestoria-service-highlight-value">${item.value}</strong>
          </div>
        `).join('')}
      </div>
    `
    : '';
  const detailClassName = `gestoria-service-detail${service.detailClass ? ` ${service.detailClass}` : ''}`;

  const sectionsMarkup = service.detailSections?.length
    ? service.detailSections.map(renderGestoriaServiceSection).join('')
    : `
      <div class="gestoria-service-block">
        <h4>&iquest;Que necesito?</h4>
        ${renderGestoriaServiceList(service.needs)}
      </div>
      <div class="gestoria-service-block">
        <h4>&iquest;Para quien es?</h4>
        <p>${service.audience}</p>
      </div>
      <div class="gestoria-service-block">
        <h4>&iquest;Cuanto cuesta?</h4>
        <p>${service.cost}</p>
        ${service.includeCalculator ? `<p class="gestoria-service-inline-copy">${service.costActionText || 'Para calcular el estimado, presion&aacute;'} <button type="button" class="gestoria-service-inline-trigger" data-transfer-calculator-toggle aria-expanded="false" aria-controls="service-transfer-calculator">${service.costActionLabel || 'aqu&iacute;'}</button></p>` : ''}
      </div>
      <div class="gestoria-service-block">
        <h4>Tiempo estimado del tramite</h4>
        <p>${service.time}</p>
      </div>
    `;

  const secondaryLabelText = service.secondaryLabel || 'Abrir calculadora';
  const secondaryLabelMarkup = secondaryLabelText;
  const secondaryActionClass = '';
  const secondaryVisualClass = service.secondaryClass ? ` ${service.secondaryClass}` : '';
  const secondaryLinkAttrs = service.secondaryTargetBlank ? ' target="_blank" rel="noopener"' : '';
  const calculatorActionMarkup = service.includeCalculator
    ? `<button type="button" class="btn btn-dark${secondaryVisualClass}${secondaryActionClass}" data-transfer-calculator-toggle aria-expanded="false" aria-controls="service-transfer-calculator">${secondaryLabelMarkup}</button>`
    : (service.secondaryHref ? `<a href="${service.secondaryHref}"${secondaryLinkAttrs} class="btn btn-dark${secondaryVisualClass}${secondaryActionClass}">${secondaryLabelMarkup}</a>` : '');
  const ctaHasAnimatedHand = false;
  const ctaLabelMarkup = service.ctaLabel;
  const primaryCtaMarkup = service.domainConsultation
    ? `<button type="button" class="btn btn-dark${service.secondaryHref ? '' : ' gestoria-service-cta'}" data-domain-consultation-open>${ctaLabelMarkup}</button>`
    : `<a href="${service.ctaHref}" target="_blank" rel="noopener" class="btn btn-dark${service.secondaryHref ? '' : ' gestoria-service-cta'}${ctaHasAnimatedHand ? ' gestoria-service-cta--with-hand' : ''}">${ctaLabelMarkup}</a>`;

  const ctaMarkup = `
    <div class="gestoria-service-actions">
      ${calculatorActionMarkup}
      ${service.hidePrimaryCta ? '' : primaryCtaMarkup}
    </div>
  `;
  const domainConsultationMarkup = service.domainConsultation ? renderDomainConsultationModal() : '';

  const detailCopy = `
    <div class="gestoria-service-detail-copy">
      ${eyebrowMarkup}
      <h1>${service.title}</h1>
      <p class="gestoria-service-description">${service.summary}</p>
      ${includeMarkup}
      ${highlightsMarkup}
      ${sectionsMarkup}
      ${ctaMarkup}
      ${domainConsultationMarkup}
    </div>
  `;

  if (!service.includeCalculator) {
    return `<article class="${detailClassName}">${detailCopy}</article>`;
  }

  return `
    <article class="${detailClassName}">
      ${detailCopy}
      <div class="gestoria-service-calculator-shell" id="service-transfer-calculator" hidden>
        ${renderTransferCalculator()}
      </div>
    </article>
  `;
}

function renderGestoriaServiceHighlightIcon(item) {
  if (item.iconImg) {
    return `
      <span class="gestoria-service-highlight-icon gestoria-service-highlight-icon--image" aria-hidden="true">
        <img src="${item.iconImg}" alt="${item.iconAlt || ''}" loading="lazy">
      </span>
    `;
  }

  return item.icon ? `<span class="gestoria-service-highlight-icon" aria-hidden="true">${item.icon}</span>` : '';
}

function renderDomainConsultationModal() {
  return `
    <div class="domain-consultation-modal" data-domain-consultation-modal hidden>
      <div class="domain-consultation-backdrop" data-domain-consultation-close></div>
      <section class="domain-consultation-panel" role="dialog" aria-modal="true" aria-labelledby="domain-consultation-title">
        <button type="button" class="domain-consultation-close" data-domain-consultation-close aria-label="Cerrar consulta">&times;</button>
        <span class="domain-consultation-kicker">Consulta gratis</span>
        <h3 id="domain-consultation-title">&iquest;Cu&aacute;l es el dominio del veh&iacute;culo que quer&eacute;s consultar?</h3>
        <p>Ingres&aacute; la patente para iniciar la consulta por WhatsApp.</p>
        <form class="domain-consultation-form" data-domain-consultation-form novalidate>
          <label for="domain-consultation-input">Dominio del veh&iacute;culo</label>
          <input id="domain-consultation-input" name="domain" type="text" autocomplete="off" autocapitalize="characters" maxlength="12" placeholder="Ej: AB123CD" required>
          <p class="domain-consultation-error" data-domain-consultation-error role="status" aria-live="polite"></p>
          <button type="submit" class="btn btn-dark">Consultar por WhatsApp</button>
        </form>
      </section>
    </div>
  `;
}

function initDomainConsultationModal(scope) {
  const modal = scope.querySelector('[data-domain-consultation-modal]');
  if (!modal) return;

  const openButton = scope.querySelector('[data-domain-consultation-open]');
  const closeButtons = Array.from(modal.querySelectorAll('[data-domain-consultation-close]'));
  const form = modal.querySelector('[data-domain-consultation-form]');
  const input = modal.querySelector('#domain-consultation-input');
  const error = modal.querySelector('[data-domain-consultation-error]');
  if (!openButton || !form || !input || !error) return;

  const openModal = () => {
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.classList.add('domain-consultation-open');
    error.textContent = '';
    requestAnimationFrame(() => input.focus());
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('domain-consultation-open');
    openButton.focus();
  };

  openButton.addEventListener('click', openModal);
  closeButtons.forEach(button => button.addEventListener('click', closeModal));

  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const domain = input.value.trim().replace(/\s+/g, ' ').toUpperCase();
    if (!domain) {
      error.textContent = 'Ingres&aacute; el dominio del veh&iacute;culo para continuar.';
      input.focus();
      return;
    }

    const message = [
      'Hola, quiero hacer una consulta gratis por un informe de dominio.',
      `Dominio del vehiculo: ${domain}.`,
      'Quedo atento/a para continuar.'
    ].join('\n');
    window.open(`${WA_BASE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    closeModal();
  });
}

function initGestoriaServiceCalculatorReveal(scope) {
  const calculatorShell = scope.querySelector('#service-transfer-calculator');
  if (!calculatorShell) return;

  const triggerButtons = Array.from(scope.querySelectorAll('[data-transfer-calculator-toggle]'));
  if (!triggerButtons.length) return;

  const revealCalculator = () => {
    const wasHidden = calculatorShell.hidden;
    calculatorShell.hidden = false;
    triggerButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));
    if (wasHidden) {
      requestAnimationFrame(() => {
        calculatorShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  triggerButtons.forEach(button => {
    button.addEventListener('click', revealCalculator);
  });
}

function initGestoriaPaymentToggles(scope) {
  const toggleButtons = Array.from(scope.querySelectorAll('[data-payment-toggle]'));
  if (!toggleButtons.length) return;

  toggleButtons.forEach(button => {
    const block = button.parentElement;
    const content = block?.querySelector('[data-payment-content]');
    const icon = button.querySelector('[data-payment-toggle-icon]');
    if (!block || !content || !icon) return;

    button.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    content.classList.remove('is-expanded');
    block.classList.remove('is-expanded');
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;

      button.setAttribute('aria-expanded', String(nextExpanded));

      if (nextExpanded) {
        block.classList.add('is-expanded');
        content.classList.add('is-expanded');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.opacity = '1';
        return;
      }

      content.style.maxHeight = `${content.scrollHeight}px`;
      requestAnimationFrame(() => {
        block.classList.remove('is-expanded');
        content.classList.remove('is-expanded');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      });
    });
  });
}

function renderGestoriaServiceSection(section) {
  const toneClass = section.tone ? ` gestoria-service-block--${section.tone}` : '';
  const isPaymentAccordion = Boolean(section.paymentMethods?.length || section.paymentLogos?.length);
  const textMarkup = section.text ? `<p>${section.text}</p>` : '';
  const itemsMarkup = section.items?.length ? renderGestoriaServiceList(section.items, section.listStyle) : '';
  const noteMarkup = section.note ? `<p class="gestoria-service-note">${section.note}</p>` : '';
  const groupsMarkup = section.groups?.length
    ? `
      <div class="gestoria-service-group-grid">
        ${section.groups.map(group => `
          <div class="gestoria-service-group-card">
            <h5>${group.title}</h5>
            ${renderGestoriaServiceList(group.items)}
          </div>
        `).join('')}
      </div>
    `
    : '';
  const pricesMarkup = section.prices?.length
    ? `
      <div class="gestoria-service-price-grid">
        ${section.prices.map(price => `
          <div class="gestoria-service-price-card">
            ${price.iconImg ? `
              <span class="gestoria-service-price-icon" aria-hidden="true">
                <img src="${price.iconImg}" alt="${price.iconAlt || ''}" loading="lazy">
              </span>
            ` : ''}
            <span>
              <span class="gestoria-service-price-label">${price.label}</span>
              <strong class="gestoria-service-price-value">${price.value}</strong>
            </span>
          </div>
        `).join('')}
      </div>
    `
    : '';
  const paymentMarkup = section.paymentLogos?.length
    ? `
      <div class="gestoria-payment-logo-grid" aria-label="Medios de pago aceptados">
        ${section.paymentLogos.map(src => `
          <img src="${src}" class="gestoria-payment-logo" alt="Medio de pago" loading="lazy">
        `).join('')}
      </div>
    `
    : section.paymentMethods?.length
    ? `
      <ul class="gestoria-payment-list">
        ${section.paymentMethods.map(method => `
          <li class="gestoria-payment-item gestoria-payment-item--${method.type}">
            <span class="gestoria-payment-icon" aria-hidden="true">${renderPaymentMethodIcon(method.type)}</span>
            <span class="gestoria-payment-label">${method.label}</span>
          </li>
        `).join('')}
      </ul>
    `
    : '';
  const titleMarkup = isPaymentAccordion
    ? `
      <button type="button" class="gestoria-service-block-toggle" data-payment-toggle aria-expanded="false">
        <span class="gestoria-service-block-toggle-icon" data-payment-toggle-icon aria-hidden="true"></span>
        <span>${section.title}</span>
      </button>
    `
    : `<h4>${section.title}</h4>`;
  const contentClassName = `gestoria-service-block-content${isPaymentAccordion ? ' gestoria-service-block-content--accordion' : ''}`;
  const contentAttribute = isPaymentAccordion ? ' data-payment-content aria-hidden="true"' : '';

  return `
    <div class="gestoria-service-block${toneClass}">
      ${titleMarkup}
      <div class="${contentClassName}"${contentAttribute}>
        ${textMarkup}
        ${itemsMarkup}
        ${groupsMarkup}
        ${noteMarkup}
        ${pricesMarkup}
        ${paymentMarkup}
      </div>
    </div>
  `;
}

function renderPaymentMethodIcon(type) {
  const icons = {
    'mercado-pago': '<img src="img/payment/mercado-pago-logo.png" alt="" class="gestoria-payment-logo-img">',
    transfer: `
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="3" width="34" height="34" rx="12" fill="#EFF4FF"/>
        <path d="M12 15h16" stroke="#3563E9" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M22 11l6 4-6 4" stroke="#3563E9" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M28 25H12" stroke="#3563E9" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M18 21l-6 4 6 4" stroke="#3563E9" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    cash: `
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="4" y="9" width="32" height="22" rx="7" fill="#EAF8EF" stroke="#2E9E5B" stroke-width="1.6"/>
        <circle cx="20" cy="20" r="5" fill="#2E9E5B"/>
        <path d="M10 15c2 0 3-1.1 3.4-2.4M30 15c-2 0-3-1.1-3.4-2.4M10 25c2 0 3 1.1 3.4 2.4M30 25c-2 0-3 1.1-3.4 2.4" stroke="#2E9E5B" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    card: `
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="4" y="8" width="32" height="24" rx="7" fill="#FFF4E8" stroke="#E08B32" stroke-width="1.6"/>
        <rect x="4" y="13" width="32" height="5" fill="#E08B32"/>
        <rect x="9" y="23" width="9" height="3.2" rx="1.6" fill="#E08B32"/>
        <rect x="21" y="23" width="7" height="3.2" rx="1.6" fill="#F2C48E"/>
      </svg>
    `
  };

  return icons[type] || '';
}

function renderGestoriaServiceList(items, style = 'default') {
  const modifierClass = style === 'checks'
    ? ' gestoria-service-list--checks'
    : style === 'dashes'
    ? ' gestoria-service-list--dashes'
    : style === 'numbered'
    ? ' gestoria-service-list--numbered'
    : '';
  const tagName = style === 'numbered' ? 'ol' : 'ul';
  return `
    <${tagName} class="gestoria-service-list${modifierClass}">
      ${items.map(item => `<li>${item}</li>`).join('')}
    </${tagName}>
  `;
}

function renderTransferCalculator() {
  return `
    <div class="transferencia-form-card gestoria-transfer-form">
      <span class="transferencia-card-tag">Calculadora</span>
      <h3>Calcular transferencia</h3>
      <p class="transferencia-card-copy">Complet&aacute; los datos b&aacute;sicos para obtener un estimado.</p>

      <form id="transferencia-form" novalidate>
        <div class="form-group">
          <div class="vehicle-type-switch" role="radiogroup" aria-label="Tipo de veh&iacute;culo">
            <label class="vehicle-type-option is-active">
              <input type="radio" name="vehicleType" value="auto" checked>
              <span>Auto</span>
            </label>
            <label class="vehicle-type-option">
              <input type="radio" name="vehicleType" value="moto">
              <span>Moto</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>&iquest;El titular nuevo tiene domicilio en Misiones?</label>
          <div class="vehicle-type-switch" role="radiogroup" aria-label="Domicilio del titular nuevo en Misiones">
            <label class="vehicle-type-option is-active">
              <input type="radio" name="misionesResidence" value="si" checked>
              <span>S&iacute;</span>
            </label>
            <label class="vehicle-type-option">
              <input type="radio" name="misionesResidence" value="no">
              <span>Otra provincia</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="transfer-price">Precio de compra</label>
          <input type="number" id="transfer-price" name="price" min="1" step="1" inputmode="numeric" placeholder="Ej: 15000000" required>
        </div>

        <div class="form-group">
          <label for="transfer-age">&iquest;Hace cu&aacute;nto se certific&oacute; la firma del <span class="text-underline">vendedor</span>?</label>
          <select id="transfer-age" name="ageBracket" required>
            <option value="lt90" selected>Menos de 90 d&iacute;as</option>
            <option value="90d1y">M&aacute;s de 90 d&iacute;as y hasta 1 a&ntilde;o</option>
            <option value="1y2y">Entre 1 a&ntilde;o y 2 a&ntilde;os</option>
            <option value="2y3y">Entre 2 a&ntilde;o y 3 a&ntilde;os</option>
            <option value="3y4y">Entre 3 a&ntilde;os y 4 a&ntilde;os</option>
            <option value="gt4">M&aacute;s de 4 a&ntilde;os</option>
          </select>
        </div>

        <div class="form-group">
          <label>&iquest;Hace cu&aacute;nto se certific&oacute; la firma del <span class="text-underline">comprador</span>?</label>
          <select id="buyer-signature-range" name="buyerSignatureRange" required>
            <option value="lt15" selected>Menos de 15 d&iacute;as h&aacute;biles</option>
            <option value="gt15">M&aacute;s de 15 d&iacute;as h&aacute;biles</option>
          </select>
        </div>

        <div class="form-group conditional-field" id="buyer-signature-date-group" hidden>
          <label for="buyer-signature-date">Fecha de certificaci&oacute;n de la firma del <span class="text-underline">comprador</span></label>
          <input type="date" id="buyer-signature-date" name="buyerSignatureDate">
          <p class="form-helper" id="buyer-signature-date-help">Seleccion&aacute; la fecha para calcular los d&iacute;as h&aacute;biles aproximados.</p>
        </div>

        <button type="submit" class="btn btn-dark" id="transferencia-submit-btn">Siguiente paso</button>
      </form>

      <p class="gestoria-transfer-note">La cotizaci&oacute;n final se confirma seg&uacute;n la documentaci&oacute;n disponible y el caso puntual.</p>
    </div>
  `;
}

function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const syncNavbarScrollState = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    syncNavbarScrollState();
    window.addEventListener('scroll', syncNavbarScrollState, { passive: true });
  }

  if (toggle && links && navbar) {
    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = links.classList.toggle('open');
      navbar.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        navbar.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (!links.classList.contains('open')) return;
      if (navbar.contains(event.target)) return;
      links.classList.remove('open');
      navbar.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  let current = getCurrentPageFile();
  const currentServiceMeta = Object.values(SERVICE_PAGE_METADATA).find(service => service.pagePath === current);
  if (currentServiceMeta?.serviceHome) {
    current = currentServiceMeta.serviceHome;
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === '/')) {
      link.classList.add('active');
    }
  });
}

function updatePropertyTabStyles(activeButton) {
  document.querySelectorAll('[data-property-tab]').forEach(button => {
    button.classList.toggle('active', button === activeButton);
    button.style.color = button === activeButton ? 'var(--black)' : 'var(--gray-500)';
    button.style.borderBottomColor = button === activeButton ? 'var(--red)' : 'transparent';
  });
}

function initQuienesReadMore() {
  const content = document.querySelector('[data-quienes-expandable]');
  const trigger = document.querySelector('[data-quienes-read-more]');
  if (!content || !trigger) return;

  if (content.scrollHeight <= content.clientHeight + 8) {
    trigger.hidden = true;
    return;
  }

  trigger.addEventListener('click', () => {
    content.style.maxHeight = `${content.scrollHeight}px`;
    content.classList.add('is-expanded');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.hidden = true;
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const name = form.elements.nombre?.value.trim() || '';
    const email = form.elements.correo?.value.trim() || '';
    const message = form.elements.mensaje?.value.trim() || '';
    const statusEl = getContactFormStatus(form);

    setContactFormStatus(statusEl, '');
    submitButton?.classList.add('is-loading');
    if (submitButton) submitButton.disabled = true;

    try {
      const res = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: name,
          correo: email,
          mensaje: message,
          pageUrl: window.location.href
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar la consulta.');

      form.reset();
      showContactSuccessToast('Tu mensaje ha sido enviado correctamente. Responderemos tu mensaje en menos de 24 horas por mail.');

      // Google Ads: Formulario enviado
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', { 'send_to': 'AW-18100857997/wTOLCMunu6AcEI3ZlLdD' });
      }
    } catch (err) {
      setContactFormStatus(statusEl, err.message || 'No se pudo enviar la consulta. Intentalo nuevamente.', true);
    } finally {
      submitButton?.classList.remove('is-loading');
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function getContactFormStatus(form) {
  let statusEl = form.querySelector('.contact-form-status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.className = 'contact-form-status';
    statusEl.setAttribute('role', 'status');
    form.append(statusEl);
  }
  return statusEl;
}

function setContactFormStatus(statusEl, message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('is-error', Boolean(isError));
}

function showContactSuccessToast(message) {
  let toast = document.querySelector('.contact-success-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'contact-success-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="contact-success-card">
        <div class="contact-success-icon" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="23"></circle>
            <path d="M16 27.5 23 34l14-16"></path>
          </svg>
        </div>
        <p></p>
      </div>
    `;
    document.body.append(toast);
  }

  toast.querySelector('p').textContent = message;
  toast.hidden = false;
  toast.classList.remove('is-visible');
  window.clearTimeout(toast._hideTimer);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  toast._hideTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    window.setTimeout(() => { toast.hidden = true; }, 220);
  }, 2600);
}

function initAnalyticsTracking() {
  // Pageview
  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: window.location.pathname,
      referrer: document.referrer || null
    })
  }).catch(() => {});

  // Click tracking en botones y links importantes
  document.addEventListener('click', event => {
    const target = event.target.closest('.btn, [href*="wa.me"], .nav-links a, .nav-icon-btn, .service-card');
    if (!target) return;

    const label = (target.querySelector('h3')?.textContent || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100);
    const isWhatsapp = target.href?.includes('wa.me');

    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: isWhatsapp ? 'whatsapp_click' : 'button_click',
        element: label,
        page: window.location.pathname
      })
    }).catch(() => {});

    // Google Ads: Clic en WhatsApp
    if (isWhatsapp && typeof gtag === 'function') {
      gtag('event', 'conversion', { 'send_to': 'AW-18100857997/57PkCMWnu6AcEI3ZlLdD' });
    }
  }, { passive: true });
}
