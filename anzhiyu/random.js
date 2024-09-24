var posts=["undefined/PVE8直通核显（N100），并开启虚拟化Sriov/","undefined/这是一篇新的博文/","undefined/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };