/****************************
    
    auther: zzy

*****************************/

/******************初始化游戏数据**********************/

let data = {
  num:3,
  imgWidth:0,
  imgHeight:0,
  canvasWidth:0,
  canvasHeight:0,
  dragged:'',
  testList:[],
  correctList:[]
}
/******************用户设置数据**********************/

//设置游戏难度
difficult.addEventListener('change',function(){
  let difficult = document.querySelector('#difficult').value
  if(difficult === 'easy'){
    data.num = 3
  }else if(difficult === 'middle'){
    data.num = 6
  }else{
    data.num = 9
  }
  checkWidth()
})

//设置游戏图片
uploadImage.addEventListener('change',function(){
  let file = document.querySelector('#uploadImage').files[0]
  let fr = new FileReader()
  fr.onloadend = function(e) {
    sourceimg.src = e.target.result
    var image = new Image();
    image.src = e.target.result;
    image.onload = function(){
      data.imgWidth = this.width
      data.imgHeight = this.height
      checkWidth()
    }
  }
  //预览图片
  fr.readAsDataURL(file)
})

//检查canvas宽高
function checkWidth(){
  //设置宽高
  data.canvasHeight = document.body.clientHeight/1.4/data.num //获取游戏图片宽高并定义画板宽高
  data.canvasWidth = data.imgWidth/data.imgHeight*data.canvasHeight>document.body.clientWidth*0.6/data.num ? document.body.clientWidth*0.6/data.num:data.imgWidth/data.imgHeight*data.canvasHeight
  canvas.style.width = data.canvasWidth*data.num + 25 + 'px'
  canvas.style.marginTop = (document.body.clientHeight-data.canvasHeight*data.num)/3 + 'px'
}
/******************初始化游戏**********************/

function renderImg(image,num,imgWidth,imgHeight) {
  //图片切块,生成num**2个canvas,插入canvaslist
  let canvaslist = []
  for (var x = 0; x<num; x++) {
    for (var y = 0; y<num; y++) {
      let childNode = document.createElement('canvas')
      childNode.setAttribute('width', data.canvasWidth)
      childNode.setAttribute('height', data.canvasHeight)
      childNode.setAttribute('id', x*3+y+1)
      childNode.setAttribute('draggable', true)
      childNode.setAttribute('class', 'droptarget')
      childNode.setAttribute('style', `transform:rotate(${Math.random().toFixed()*180}deg)`) 
      let ctx = childNode.getContext('2d')
      ctx.drawImage(image,imgWidth/num*y,imgHeight/num*x,imgWidth/num,imgHeight/num,0,0,data.canvasWidth,data.canvasHeight)
      canvaslist.push(childNode)
    }
  }
  //打乱canvaslist顺序
  for (let i = 1; i < canvaslist.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [canvaslist[i], canvaslist[random]] = [canvaslist[random], canvaslist[i]];
  }
  //获取初始打乱顺序
  canvaslist.forEach(element => {
    canvas.appendChild(element)
    data.testList.push(element.id)
  })
  //获取正确顺序
  for (let i = 1; i <= data.num**2; i++) {
    data.correctList.push(i+'')
  }
}

//点击按钮开始游戏
start.addEventListener('click',function(){
  // if(document.querySelector('#uploadImage').files[0]===undefined){
  //   return
  // }
  welecome.style.display = 'none'
  canvas.style.display = 'flow-root'

  //渲染拼图
  renderImg(sourceimg,data.num,data.imgWidth,data.imgHeight)

  //判断游戏胜利
  var timer = setInterval(function(){
    //判断角度
    let correctRotate = []
    document.querySelectorAll('canvas').forEach(element=>{
      if(element.style.transform.replace(/[^0-9]/ig,"")-0 === 0){
        correctRotate.push(element)
      }
    })
    //判断顺序
    if(data.testList.toString() == data.correctList.toString() && correctRotate.length === data.num**2){
      clearInterval(timer)  //清除定时器
      alert('游戏胜利')
      if (window.confirm("是否开始新游戏")) {
        document.querySelectorAll('canvas').forEach(element=>{
          element.parentNode.removeChild(element);
        })
        welecome.style.display = 'flow-root'
        canvas.style.display = 'none'
        data.testList = [],
        data.correctList = []
      }
    }
  },1000)
})

/******************拼图游戏中**********************/

//双击换角度
canvas.addEventListener('dblclick',function(){
  if (event.target.tagName.toLowerCase() === 'canvas') {
    let rotate = event.target.style.transform.replace(/[^0-9]/ig,"")
    if(rotate == 0){
      event.target.style.transform = `rotate(${rotate-0+180}deg)`
    }else{
      event.target.style.transform = `rotate(${rotate-180}deg)`
    }
  }
})

//拖拽触发
document.addEventListener("dragstart", function(event) {
  data.dragged = event.target
}, false)

//拖拽过程
document.addEventListener("drag", function(event) {
})

//拖拽进入
document.addEventListener("dragenter", function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
    event.target.style.border = '1px solid #1e90ff'
  }
})

//拖拽离开
document.addEventListener("dragleave", function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
      event.target.style.border = 'none'
  }
})

//拖拽放下
document.addEventListener("drop", function(event) {
  event.preventDefault();
    if(event.target.tagName.toLowerCase() === 'canvas' &&event.target !== data.dragged) {
      let dragId = data.dragged.id
      let targetId = event.target.id
      let dragIndex = data.testList.indexOf(dragId)
      let targetIndex = data.testList.indexOf(targetId)
      data.testList[dragIndex] = targetId
      data.testList[targetIndex] = dragId
      function cloneCanvas(oldCanvas) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d')
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height
        newCanvas.id = oldCanvas.id
        newCanvas.style.transform = oldCanvas.style.transform
        newCanvas.setAttribute('draggable', true)
        newCanvas.setAttribute('class', 'droptarget')
        context.drawImage(oldCanvas, 0, 0)
        return newCanvas;
      }
      let cloneDraged = cloneCanvas(data.dragged)
      let cloneTarget = cloneCanvas(event.target)
      canvas.appendChild(cloneDraged)
      canvas.appendChild(cloneTarget)
      canvas.replaceChild(cloneDraged, event.target)
      canvas.replaceChild(cloneTarget, data.dragged)
    }
})

document.addEventListener("dragover", function(event) {
  event.preventDefault();
})