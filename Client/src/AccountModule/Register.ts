import Swal from "sweetalert2";

document.getElementById("registerButton")?.addEventListener("click",async () => {
    const { value: formValues } = await Swal.fire({
        title: 'ĐĂNG KÝ',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Tên người dùng">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Mật khẩu" type="password">' +
            '<div class="container">' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img1" name="image" value="img1" style="display: none;">' +
            '      <label class="ava" for="img1"><img src="./assets/ava01.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img2" name="image" value="img2" style="display: none;">' +
            '      <label class="ava" for="img2"><img src="./assets/ava02.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img3" name="image" value="img3" style="display: none;">' +
            '      <label class="ava" for="img3"><img src="./assets/ava03.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img4" name="image" value="img4" style="display: none;">' +
            '      <label class="ava" for="img4"><img src="./assets/ava04.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img5" name="image" value="img5" style="display: none;">' +
            '      <label class="ava" for="img5"><img src="./assets/ava05.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img6" name="image" value="img6" style="display: none;">' +
            '      <label class="ava" for="img6"><img src="./assets/ava06.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '</div>',

        focusConfirm: false,
        preConfirm: () => {
            //   let inputUsername = document.getElementById('swal-input1')! as HTMLInputElement;
            let username = (document.getElementById('swal-input1')! as HTMLInputElement).value
            let password = (document.getElementById('swal-input2')! as HTMLInputElement).value
            let avatar = (document.querySelector('input[name="image"]:checked') as HTMLInputElement).value;
            if (!username && !password) {
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng và mật khẩu');
            } else if (!password){
                Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
            } else if (!username){
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng');
            } else if (password.length < 5) {
                Swal.showValidationMessage('Mật khẩu phải có ít nhất 5 ký tự.');
            } else {
                return [username, password, avatar];
            }
        }
    })
    if (formValues) {
        // console.log("username: " + formValues[0] + ", password: " + formValues[1] + ", avatar: " + formValues[2])          // Swal.fire(`Tên người dùng: ${formValues[0]}<br>Mật khẩu: ${formValues[1]}`)
    }
})