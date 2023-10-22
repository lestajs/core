export default {
  mainHead: 'Скважина',
  localTokens : {
    cancel: 'Отменить',
    apply: 'Применить',
    submit: 'Отправить',
  },
  send: (values) => {
    console.log(values)
  },
  form: {
    name: 'well',
    elements: [
      {
        name: 'name',
        component: 'input',
        text: 'Название проекта',
        type: 'text',
        required: true
      },
      {
        name: 'depth',
        component: 'input',
        text: 'Глубина скважины',
        type: 'number',
        default: 35,
        step: '0.01',
        fixed: 2,
        min: '0',
      }
    ],
    children: [
      {
        name: 'construction',
        head: 'Конструкция скважины',
        children: [
          {
            name: 'columns',
            head: 'Обсадная колонна',
            error: 'Поле “До” должно быть больше поля “От”',
            collection: {
              minlength: 1,
              maxlength: 10,
            },
            elements: [{
              component: 'input',
              name: 'd',
              text: 'Диаметр колонны, мм',
              type: 'number',
              min: '0',
              value: 0
            },
              {
                component: 'input',
                name: 'from',
                text: 'От, м',
                type: 'number',
                step: '0.01',
                fixed: 2,
                min: '0',
                value: 0,
              },
              {
                component: 'input',
                name: 'to',
                text: 'До, м',
                type: 'number',
                step: '0.01',
                fixed: 2,
                min: '0',
                required: true,
                value: 0,
                validation: 'value > _values.well.construction.columns[index].from && value <= _values.well.depth',
                error: 'Значение не должно превышать глубину скважины.',
              }]
          },
          {
            name: 'filter_columns',
            head: 'Фильтровая колонна',
            error: 'Поля обязательны для заполнения. Поле “До” должно быть больше поля “От” и не должно превышать глубину скважины',
            hidden: '_values.well.construction.filter_columns[index].type === "Фильтровая колонна"',
            collection: {
              minlength: 1,
              maxlength: 10,
            },
            elements: [
              {
                component: 'input',
                name: 'd',
                text: 'Диаметр колонны, мм',
                type: 'number',
                min: '0',
                value: 0,
              },
              {
                component: 'input',
                name: 'from',
                text: 'От, м',
                type: 'number',
                step: '0.01',
                fixed: 2,
                min: '0',
                value: 0,
              },
              {
                component: 'input',
                name: 'to',
                text: 'До, м',
                type: 'number',
                step: '0.01',
                fixed: 2,
                min: '0',
                required: true,
                value: 0,
                validation: 'value <= _values.well.depth',
                error: 'Значение не должно превышать глубину скважины.',
              },
              {
                component: 'buttons',
                name: 'type',
                text: 'Тип колонны',
                value: 'Открытый ствол',
                buttons: ['Открытый ствол', 'Фильтровая колонна'],
                type: 'radio',
                row: true
              }
            ],
            children: [{
              name: 'filters',
              head: 'Рабочие интервалы',
              error: 'Поля “От” и “До” должны лежать в интервале установки фильтровой колонны, при этом поле “До” больше поля “От”',
              collection: {
                minlength: 1,
                maxlength: 10,
              },
              elements: [
                {
                  component: 'input',
                  name: 'from',
                  text: 'От, м',
                  type: 'number',
                  step: '0.01',
                  fixed: 2,
                  min: '0',
                  value: 0,
                  validation: 'value >= _values.well.construction.filter_columns[currentIndex.filter_columns].from',
                },
                {
                  component: 'input',
                  name: 'to',
                  text: 'До, м',
                  type: 'number',
                  step: '0.01',
                  fixed: 2,
                  min: '0',
                  required: true,
                  value: 0,
                  validation: 'value <= _values.well.depth',
                  error: 'Значение не должно превышать глубину скважины.',
                }
              ],
            }]
          }
        ],
      },
      {
        name: 'data',
        head: 'Оснастка',
        error: 'Глубина установки насоса не должна превышать глубину скважины, а Динамический уровень должен быть больше или равен Статическому уровню',
        elements: [
          {
            component: 'input',
            name: 'pump_type',
            text: 'Название насоса'
          },
          {
            component: 'input',
            name: 'pump_depth',
            text: 'Глубина установки насоса, м',
            type: 'number',
            step: '0.01',
            fixed: 2,
            min: '0',
            validation: 'value <= _values.well.depth',
          },
          {
            component: 'input',
            name: 'static_lvl',
            text: 'Статический уровень, м',
            type: 'number',
            step: '0.01',
            fixed: 2,
            min: '0',
            validation: 'value <= _values.well.data.dynamic_lvl && value <= _values.well.depth'
          },
          {
            component: 'input',
            name: 'dynamic_lvl',
            text: 'Динамический уровень, м',
            type: 'number',
            step: '0.01',
            fixed: 2,
            min: '0',
            validation: 'value >= _values.well.data.static_lvl && value <= _values.well.depth'
          }
        ]
      },
      {
        name: 'layers',
        head: 'Геологическое строение',
        children: [{
          name: 'layer',
          head: 'Горизонт',
          collection: {
            minlength: 1,
            maxlength: 10,
          },
          error: 'Геологические слои должны залегать в интервале глубины скважины без наложения.',
          elements: [{
              name: 'name',
              component: 'input',
              text: 'Индекс',
              type: 'text',
              required: true
            },
            {
              component: 'input',
              name: 'from',
              text: 'От, м',
              disabled: true,
              type: 'number',
              step: '0.01',
              fixed: 2,
              min: '0',
              binding: '_values.well.layers.layer[index-1]?.to || 0',
            },
            {
              component: 'input',
              name: 'to',
              text: 'До, м',
              type: 'number',
              step: '0.01',
              fixed: 2,
              min: '0',
              required: true,
              binding: 'index === length - 1 ? _values.well.depth : value',
              validation: 'value > _values.well.layers.layer[index].from && value <= _values.well.depth',
            },
            {
              name: 'interlayers',
              component: 'nest',
              text: 'Тип отложений',
              type: 'multiple',
              validation: 'value.length > 1',
              required: true,
              value: [],
              list: [
                'пески',
                'пески мелкие',
                'пески средние',
                'пески крупные',
                'суглинки',
                'супеси',
                'глины',
                'известняки',
                'мергели',
                'песчаники',
                'доломиты',
                'мел',
                'гнейсы',
                'граниты'
              ]
            },
            {
              name: 'inclusions',
              component: 'nest',
              text: 'Тип прослоев',
              type: 'multiple',
              value: [],
              list: [
                'пески',
                'пески мелкие',
                'пески средние',
                'пески крупные',
                'суглинки',
                'супеси',
                'глины',
                'известняки',
                'мергели',
                'песчаники',
                'доломиты',
                'мел',
                'гнейсы',
                'граниты'
              ]
            },
            {
              name: 'sediments',
              component: 'nest',
              text: 'Типы вкраплений',
              type: 'multiple',
              value: [],
              list: [
                'глыбы',
                'валуны',
                'галька',
                'щебень',
                'гравий',
                'фосфориты (в подошве слоя)'
              ]
            }
          ]
        }]
      }
    ]
  }
}