const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
    
const app = new Vue({
    el: '#app',
    data: {
      goods: [],
      filteredGoods: [],
      searchLine: '',
      isCartVisible: false
    },
    computed: {
        searchRegExp: function() {return new RegExp(this.searchLine,'i');}
    },
    methods: {
        toogleCart() {
           this.isCartVisible = !this.isCartVisible;
        },
        makeGETRequest(url, callback) {
         
          var xhr;
    
          if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { 
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          }
    
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              callback(xhr.responseText);
            }
          }
    
          xhr.open('GET', url, true);
          xhr.send();
        },
        mounted() {
            this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
              this.goods = JSON.parse(goods);
              this.filteredGoods = this.goods.filter(i => this.searchRegExp.test(i.product_name));
            });
          }
      }
    });

app.mounted();