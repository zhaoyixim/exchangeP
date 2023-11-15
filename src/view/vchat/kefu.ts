

const  dataURLtoFile = async(dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
     while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
     }
     // 方式1：
    // let newBlob = new Blob([u8arr],"file", {
    //         type: mime
    //     });
    //     newBlob.lastModifiedDate = new Date();
    //     newBlob.name = Date.now() + '.png';
    //     return newBlob
    return new File([u8arr], Date.now() + ".png", { type: mime });
  }

const getVideoBase64=(url) =>{
    return new Promise(function (resolve, reject) {
      let dataURL = "";
      let ua = navigator.userAgent.toLowerCase();
      //  ios 存在video标签不显示同时ios手机端视频上传的格式是.mov格式的文件，故ios视频上传的视频采用默认视频封面提的处理方式，
      let isIos = ua.match(/Android/i) ? false : true;
        if(url.includes('.mov') || isIos){
            let imgUrl ='../../assets/video_icon.png'
            resolve(imgUrl)
        }else{
            let video = document.createElement("video");
            video.setAttribute("crossOrigin", "anonymous"); //处理跨域
            video.setAttribute("src", url);
            video.setAttribute("width", "304");
            video.setAttribute("height", "180");
            video.currentTime = 0.5;
            video.addEventListener("loadeddata", async function () {
                let canvas = document.createElement("canvas");
                let width = video.width; //canvas的尺寸和图片一样
                let height = video.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d")?.drawImage(video, 0, 0, width, height); //绘制canvas
                dataURL = canvas.toDataURL("image/png"); //转换为base64
                let file = dataURLtoFile(dataURL, "file");
                console.log(file, "file");
                const suffix = `.${(await file).type.split("/")[1]}`;
                const size_list = (await file).size;
                resolve(file)
            })
        }
    })
}
export default getVideoBase64;