var drawer = null

function onresize() {
  const wrapper = document.getElementById('wrapper')
  drawer = new SmilesDrawer.Drawer({
    width:  wrapper.offsetWidth,
    height: wrapper.offsetHeight,
    compactDrawing: false
  })
}

function onsubmit(redraw) {
  const input  = document.getElementById('smiles')
  let   smiles = input.value
  const index  = smiles.search(/\s/)
  if(index !== -1) {
    // TODO: Warn about the truncation?
    smiles = smiles.substring(0, index)
  }

  SmilesDrawer.parse(smiles, function(tree) {
    input.classList.remove('invalid')
    if(redraw) {
      drawer.draw(tree, 'canvas', 'light')
    }
  }, function(error) {
    input.classList.add('invalid')
    console.log(error)
  })
}

const url = new URL(window.location.href)
const mol = url.searchParams.get('mol')
if(mol) {
  const input = document.getElementById('smiles')
  input.value = mol
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
