var drawer = null

function onresize() {
  const wrapper = document.getElementById('wrapper')
  drawer = new SmilesDrawer.Drawer({
    width:  wrapper.offsetWidth,
    height: wrapper.offsetHeight
  })
}

function onsubmit(redraw) {
  const smiles = document.getElementById('smiles')

  SmilesDrawer.parse(smiles.value, function(tree) {
    smiles.classList.remove('invalid')
    if(redraw) {
      drawer.draw(tree, 'canvas', 'light')
    }
  }, function(error) {
    smiles.classList.add('invalid')
    console.log(error)
  })
}


window.addEventListener('resize', function(event) {
  onresize()
})

document.getElementById('form').addEventListener('submit', function(event) {
  event.stopPropagation()
  event.preventDefault()
  onsubmit(true)
})

document.getElementById('smiles').addEventListener('keyup', function(event) {
  const auto = document.getElementById('auto')
  onsubmit(auto.checked)
})

onresize()
onsubmit(true)
