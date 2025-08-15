<div id="rating-card" style="
  max-width:320px;
  margin:20px auto;
  padding:20px;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.1);
  background:#fff;
  font-family:sans-serif;
  text-align:center;
">
  <div id="rating-title" style="margin-bottom:10px; font-weight:bold; font-size:18px;">RATING 0/5</div>
  <div id="stars" style="display:flex; justify-content:center; gap:5px;"></div>
  <div id="rating-text" style="margin-top:10px; font-weight:bold; color:#555;"></div>
</div>

<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

<script>
(async function(){
  const ratingLabels = ["SANGAT BURUK","BURUK","CUKUP","LUMAYAN","SANGAT BAIK"];
  const starsDiv = document.getElementById('stars');
  const title = document.getElementById('rating-title');
  const ratingText = document.getElementById('rating-text');
  const maxStars = 5;
  let userRated = false;

  // check per IP (simulasi pakai localStorage)
  const ipKey = 'user_ip_rating';
  if(localStorage.getItem(ipKey)) userRated = true;

  // load rating dari file lokal
  async function loadRating(){
    try{
      const res = await fetch('ratings.json');
      if(!res.ok) throw new Error('File JSON tidak ditemukan');
      const data = await res.json();
      let avg = 0;
      if(data.length){
        avg = data.reduce((a,b)=>a+b.rating,0)/data.length;
      }
      title.innerText = `RATING ${avg.toFixed(1)}/5`;
      updateStars(avg);
    }catch(e){ 
      console.log('Gagal load rating', e); 
    }
  }

  function updateStars(value){
    starsDiv.innerHTML = '';
    for(let i=1;i<=maxStars;i++){
      const star = document.createElement('i');
      star.className = i<=Math.round(value)?'fa-solid fa-star':'fa-regular fa-star';
      star.style.fontSize='2rem';
      star.style.color=i<=value?'gold':'#ccc';
      star.dataset.value = i;
      starsDiv.appendChild(star);

      if(!userRated){
        star.style.cursor='pointer';
        star.addEventListener('mouseover', ()=>ratingText.innerText=ratingLabels[i-1]);
        star.addEventListener('mouseout', ()=>ratingText.innerText='');
        star.addEventListener('click', ()=>{
          const rating = i;
          userRated = true;
          localStorage.setItem(ipKey, rating);
          ratingText.innerText = ratingLabels[i-1];
          alert(`Terima kasih! Anda memberi rating ${rating} - ${ratingLabels[i-1]}`);

          // update tampilan rata-rata (simulasi)
          const currentAvg = parseFloat(title.innerText.split(' ')[1]);
          const newAvg = (currentAvg + rating)/2;
          title.innerText = `RATING ${newAvg.toFixed(1)}/5`;
          updateStars(newAvg);

          // opsional: simpan ke ratings.json via server/API
          console.log('Rating baru (simulasi):', rating);
        });
      }
    }
  }

  await loadRating();
})();

</script>
