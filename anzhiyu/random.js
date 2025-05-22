var posts=["undefined/用Mihomo打造最强代理机/","undefined/常用VPS脚本/","undefined/PVE8直通核显（N100），并开启虚拟化Sriov/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };