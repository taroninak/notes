var UserModel = new Vue({
  el: '#users',
  data: {
    users: []
  }
});
axios.get('/api/users').then(function (res) {
    UserModel.users = res.data;
}).catch(function (err) {
    console.log(err);
});
