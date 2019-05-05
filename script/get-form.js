let data = {
  num:3,
  image:document.querySelector('#look'),
  imgWidth:0,
  imgHeight:0,
  canvasWidth:0,
  canvasHeight:0,
  correctList:[],
  randomList:[],
  dragged:'',
  target:''
}

//更改图片事件
uploadImage.addEventListener('change',function(){
  let file = document.querySelector('#uploadImage').files[0]
  let fr = new FileReader()
  fr.onloadend = function(e) {
    data.image.src = e.target.result
    var image = new Image();
    image.src = e.target.result;
    image.onload = function(){
      data.imgWidth = this.width
      data.imgHeight = this.height
      data.canvasWidth = 400/data.num
      data.canvasHeight = 400/data.num/data.imgWidth * data.imgHeight
    }
  }
  //预览图片
  fr.readAsDataURL(file)
})

//改变难度事件
difficult.addEventListener('change',function(){
  let difficult = document.querySelector('#difficult').value
  if(difficult === 'easy'){
    data.num = 3
  }else if(difficult === 'middle'){
    data.num = 6
  }else{
    data.num = 9
  }
})

//开始游戏
start.addEventListener('click',function(){
  renderImg(data.image,data.num,data.imgWidth,data.imgHeight)
  randomImg()
})
//图片切块
function renderImg(image,num,imgWidth,imgHeight) {
  for (var x = 0; x<num; x++) {
    for (var y = 0; y<num; y++) {
      let childNode = document.createElement('canvas')
      childNode.setAttribute('width', data.canvasWidth)
      childNode.setAttribute('height', 400/data.num/data.imgWidth * data.imgHeight)
      childNode.setAttribute('order', x*3+y+1)
      childNode.setAttribute('draggable', true)
      childNode.setAttribute('class', 'droptarget') 
      let ctx = childNode.getContext('2d')
      ctx.drawImage(image,imgWidth/num*y,imgHeight/num*x,imgWidth/num,imgHeight/num,0,0,data.canvasWidth,data.canvasHeight)
      data.correctList.push(childNode)
    }
  }
}
//图片打乱顺序并插入
function randomImg(){
  data.randomList = data.correctList
  for (let i = 1; i < data.randomList.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [data.randomList[i], data.randomList[random]] = [data.randomList[random], data.randomList[i]];
  }
  data.randomList.forEach(element => {
    canvas.appendChild(element)
  })
}

//拖拽触发
document.addEventListener("dragstart", function( event ) {
  data.dragged = event.target
}, false)

//拖拽过程
document.addEventListener("drag", function(event) {
})

//拖拽进入
document.addEventListener("dragenter", function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
    event.target.style.border = '1px solid red'
  }
})

//拖拽离开
document.addEventListener("dragleave", function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
      event.target.style.border = 'none'
  }
})

document.addEventListener("drop", function(event) {
  event.preventDefault();
  if (event.target.tagName.toLowerCase() === 'canvas') {
    data.target = event.target
    let dragBrother = data.dragged.nextSibling
    let targetBrother = data.target.nextSibling
    data.dragged.parentNode.removeChild(data.dragged)
    data.target.parentNode.removeChild(data.target)
  }
})

document.addEventListener("dragover", function(event) {
  event.preventDefault();
})

// setInterval(()=>{
//   if(data.correctList === data.randomList){
//     alert('游戏胜利!')
//   }
// },100)