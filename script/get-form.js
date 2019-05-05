let data = {
  num:3,
  image:document.querySelector('#look'),
  imgWidth:0,
  imgHeight:0
}
let ctx = document.querySelector("#canvas").getContext('2d')

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
      canvas.height = 400/data.imgWidth * data.imgHeight
      console.log(data.imgHeight)
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
  renderImg(data.image,data.num,canvas.width,canvas.height,data.imgWidth,data.imgHeight)
})
//图片处理
function renderImg(image,num,canvasWidth,canvasHeight,imgWidth,imgHeight) {
  //图片切块
  for (var x = 0; x<num; x++) {
    for (var y = 0; y<num; y++) {
      ctx.drawImage(image,imgWidth/num*x,imgHeight/num*y,imgWidth/num,imgHeight/num,canvasWidth/num*x,canvasHeight/num*y,canvasWidth/num,canvasHeight/num)
      console.log(imgWidth/num*x)
    }
  }
}