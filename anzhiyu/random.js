var posts=["undefined/常用VPS脚本/","undefined/PVE8直通核显（N100），并开启虚拟化Sriov/","undefined/这是一篇新的博文/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };