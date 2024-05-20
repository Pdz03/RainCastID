async function toggle_like(post_id, type, row) {
    let response = await axios.get("/auth_login");
    let authLogin = await response.data;
    if(authLogin){
    let today = new Date().toISOString()
    let $a_like = $(`a[aria-label='heart']`);
    if(row !== ''){
        $a_like = $(`a[aria-label='heart-${row}']`);
    }
    let $i_like = $a_like.find("i");
    if ($i_like.hasClass("bi-heart-fill") && $i_like.hasClass("text-danger")) {
      $.ajax({
        type: "POST",
        url: "/update_like",
        data: {
          post_id_give: post_id,
          type_give: type,
          date_give: today,
          action_give: "unlike",
        },
        success: function (response) {
          console.log("unlike");
          if(row !== ''){
            $(`#like-${row}`).removeClass("text-danger");
            $(`#likenum-${row}`).text(num2str(response["count"]))
          }else{
          $i_like.removeClass("text-danger");
          $("span.like-num").text(num2str(response["count"]))
          }
          
        },
      });
    } else {
      $.ajax({
        type: "POST",
        url: "/update_like",
        data: {
          post_id_give: post_id,
          type_give: type,
          date_give: today,
          action_give: "like",
        },
        success: function (response) {
          console.log("like");
          if(row !== ''){
            $(`#like-${row}`).addClass("text-danger");
            $(`#likenum-${row}`).text(response["count"]);
          }else{
          $i_like.addClass("text-danger");
          $("span.like-num").text(response["count"]);
          }
          
        },
      });
    }
    }else{
        alert('ANDA HARUS LOGIN UNTUK DAPAT MENYUKAI!')
    }
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    return count
  }