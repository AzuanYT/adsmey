<script>
document.addEventListener("DOMContentLoaded", function() {

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    .more-mods-wrapper { text-align:center; margin:20px 0; }
    .more-mods-img-btn {
        width:100%;
        max-width:350px;
        height:auto;
        display:block;
        margin:0 auto;
        user-select:none;
        -webkit-user-drag:none;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const wrapper = document.createElement("div");
  wrapper.className = "more-mods-wrapper";
  wrapper.innerHTML = `
    <a class="more-mods-btn"
      href="https://signingunwilling.com/xg957wjx?key=06036766e099d326a71a5037fd19b8e4"
      onclick="setTimeout(function(){ window.location.href='/search/label/GAME?m=1'; },2000);"
      rel="nofollow" target="_blank">

      <img class="more-mods-img-btn" alt="See All Games"
      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEin0Vi9tmrYRDncxB98fdmlYNOSs6RuVo_wXCKIO3g9hcAIjvKqw8fAVOHwI4q3ScYC9jANldGX8jDN6pbOUvysBpDO8Fa__ap_z08IjLrSDjKohutxoLw9BbeO7R1Le79itFJysQTonrRKswO4eFFS5pG5E_IZFlOjlyccOQe4RvwrJnfc_fSIRwyhCnU/s1191/1752673385935.png">
    </a>
  `;
  document.body.appendChild(wrapper);

  // Disable right-click on image
  document.addEventListener("contextmenu", function(e) {
    if (e.target.classList.contains("more-mods-img-btn")) {
      e.preventDefault();
    }
  });

});
</script>
