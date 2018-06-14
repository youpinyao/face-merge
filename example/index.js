let file = null;

$.get('./templates.json').then(res => {
  $('#templates').html(res.map((item, i) => `
    <label>
      <input type="radio" ${i === 0 ? 'checked' : ''} name="template" value="${item.model_id}"/>
      <div><img src="${item.src}" alt=""/></div>
      <div>${item.name}</div>
    </label>
  `))
});


$('#file').bind('change', e => {
  console.log('====================================');
  console.log(e.target.files);
  console.log('====================================');
  const reader = new FileReader();

  reader.onload = (e) => {
    file = e.target.result;
  }

  reader.readAsDataURL(e.target.files[0]);
});

$('#merge').bind('click', e => {
  if (!file) {
    alert('请选择图片');
    return;
  }
  $('#box').html('生成中....');
  $.post({
    url: '/merge',
    contentType: 'text/json',
    data: JSON.stringify({
      img_data: file,
      model_id: $('input[name="template"]:checked').val(),
    }),
  }).then(res => {
    if (res.ret == 0) {
      $('#box').html(`
        <img src="${res.img_url}" style="width: 300px; height: auto;" />
      `);
    } else {
      $('#box').html(JSON.stringify(res));
    }
  }, res => {
    $('#box').html(JSON.stringify(res));
  })
});

