console.log('MODULE: accepter', module.id)

require('./dep')

if (module.hot) {
  module.hot.accept('./dep', () => {
    require('./dep')
  })
}
