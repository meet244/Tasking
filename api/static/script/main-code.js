const mainColors = getComputedStyle(document.documentElement).getPropertyValue('--main-colors').split(',');

const randomIndex = Math.floor(Math.random() * mainColors.length);

const randomColor = mainColors[randomIndex].trim();

const style = document.createElement('style');
style.innerHTML = `:root { --main-color: ${randomColor}; }`;
document.head.appendChild(style);



function auto_grow() {
    element = document.getElementById('task')
    element.style.height = "0px";
    element.style.height = (element.scrollHeight)+"px";
    element = document.getElementById('note')
    element.style.height = "0px";
    element.style.height = (element.scrollHeight)+"px";
}

let data =[]

let uurl = window.location.toString().split("/")[0];

let current_list_no = 0
let current_task_no = 0
async function SD(){

  async function checkValue() {
    var uidElement = document.getElementById("uid");
    if (uidElement.textContent.trim() != "") {
      clearInterval(intervalId); 
      
      let bodyContent = new FormData();
      bodyContent.append("token", document.getElementById("uid").textContent.toString());
      
      let response = await fetch(uurl+"/verify", { 
        method: "POST",
        body: bodyContent
      });
      
      data = await response.json();
      

      document.getElementById('spiral').style['zIndex'] = '-5000';
      load_left();
    }
  }
  var intervalId = setInterval(checkValue, 1000);

}

function load_left(){

  
  const listItemsContainer = document.getElementById('list-items');

  
  while (listItemsContainer.lastElementChild) {
    listItemsContainer.removeChild(listItemsContainer.lastElementChild);
  }

  if(data.length == 0){
    document.getElementById('b1').style['display'] = 'none'
    document.getElementById('hint').style['display'] = 'none'

    document.getElementById('ttitle').style['display'] = 'none'
    document.getElementById('tdetail').style['display'] = 'none'
    document.getElementById('tdetail2').style['display'] = 'none'
    document.getElementById('btm').style['display'] = 'none'
    document.getElementById('notask').style['display'] = 'inherit'
    document.getElementById('notask2').style['display'] = 'inherit'
    return
  }
  else{
    document.getElementById('b1').style['display'] = 'inherit'
    document.getElementById('hint').style['display'] = 'inherit'
    document.getElementById('ttitle').style['display'] = 'inherit'
    document.getElementById('tdetail').style['display'] = 'inherit'
    document.getElementById('tdetail2').style['display'] = 'inherit'
    document.getElementById('btm').style['display'] = 'inherit'
    document.getElementById('notask').style['display'] = 'none'
    document.getElementById('notask2').style['display'] = 'none'
  }
  

  for (let i = 0; i < data.length; i++) {
    const listItem = document.createElement('div');
    listItem.className = 'listn';

    const icon = document.createElement('i');
    icon.className = 'fas fa-list';
    listItem.appendChild(icon);

    const itemData = data[i];

    const paragraph = document.createElement('p');
    paragraph.textContent = itemData['name'];
    listItem.appendChild(paragraph);

    if (i === 0) {
      listItem.classList.add('selected');
      load_center();
    }

    listItem.id = itemData._id;
    listItem.setAttribute('onclick', `list_shw(${i});`);
    listItemsContainer.appendChild(listItem);
  } 
}

function load_center(){
  document.getElementById('curlisname').textContent = data[current_list_no]['name'];

  
  rem_chld = ['d1-1','d1-2']
  for (let ele = 0; ele < (rem_chld.length); ele++) {
    let c = document.getElementById(rem_chld[ele]).lastElementChild;
    while(c){
      document.getElementById(rem_chld[ele]).removeChild(c);
      c = document.getElementById(rem_chld[ele]).lastElementChild;
    }
  }
  document.getElementById('complete').style['display'] = 'none'

  if(data[current_list_no]['data'].length == 0){
    document.getElementById('ttitle').style['display'] = 'none'
    document.getElementById('tdetail').style['display'] = 'none'
    document.getElementById('tdetail2').style['display'] = 'none'
    document.getElementById('btm').style['display'] = 'none'
    document.getElementById('notask').style['display'] = 'inherit'
    document.getElementById('notask2').style['display'] = 'inherit'
    return
  }
  else{
    document.getElementById('ttitle').style['display'] = 'inherit'
    document.getElementById('tdetail').style['display'] = 'inherit'
    document.getElementById('tdetail2').style['display'] = 'inherit'
    document.getElementById('btm').style['display'] = 'inherit'
    document.getElementById('notask').style['display'] = 'none'
    document.getElementById('notask2').style['display'] = 'none'
  }

  let tsk = 0
  let comp = []
  let incomp = []
  for (let i = 0; i < data[current_list_no]['data'].length; i++) {
    let d = data[current_list_no]['data'][i]
    tsk++;
    if (d[3] == false){
      comp.push(d)
    }
    else{
      incomp.push(d)
    }
  }

  for (let i = 0; i < comp.length; i++) {
    let c = comp[i]
    
    let divm = document.createElement('div')

    divm.className= 'shape'
    divm.id = `t${document.getElementById('d1-2').children.length+1+i}`
    let div = document.createElement('div')
    let icn = document.createElement('i');
    icn.className = 'far fa-circle cir';
    icn.setAttribute("onclick",`check('${data[current_list_no]['data'].indexOf(c)}')`);
    div.appendChild(icn)
    let p = document.createElement('p');
    p.textContent = c[0]
    div.appendChild(p)
    divm.setAttribute("onclick",`task_shw('${data[current_list_no]['data'].indexOf(c)}')`);

    hasdue = false;
    if(c[1] != ''){
      hasdue = true;
      let s = document.createElement('span');
      s.className = 'due';
      let icn = document.createElement('i');
      icn.className = 'far fa-calendar-times';
      s.appendChild(icn)
      let t = document.createElement('text');
      let xd = comp[i][1]
      t.textContent = (`${xd.slice(6,8)}-${xd.slice(4,6)}-${xd.slice(0,4)}`)

      var today = new Date();
      nx = JSON.stringify(today).split('-')
      yn = nx[0].slice(1, 5)
      mn = nx[1]
      dn = nx[2].slice(0, 2)

      if (dn == xd.slice(6,8)){
        if (mn == xd.slice(4,6)){
          if (yn == xd.slice(0,4)){
            s.className = 'due rd';
          }
        }
      }

      var nextDay = new Date();
      nextDay.setDate(today.getDate() + 1);
      nx = JSON.stringify(nextDay).split('-')
      yn = nx[0].slice(1, 5)
      mn = nx[1]
      dn = nx[2].slice(0, 2)

      if (dn == xd.slice(6,8)){
        if (mn == xd.slice(4,6)){
          if (yn == xd.slice(0,4)){
            s.className = 'due rd';
          }
        }
      }

      
      s.appendChild(t)
      div.appendChild(s)
    }

    if(c[2] != ''){
      let s = document.createElement('span');
      s.className = 'notes';
      if (hasdue){
        let d = document.createElement('dot');
        d.className = 'dot';
        d.textContent = ' • '
        div.appendChild(d)
      }
      let icn = document.createElement('i');
      icn.className = 'far fa-sticky-note';
      s.appendChild(icn)
      let t = document.createElement('text');
      t.textContent = (comp[i][2])
      s.appendChild(t)
      div.appendChild(s)
    }

    divm.appendChild(div);
    document.getElementById('d1-1').appendChild(divm)

  }

  for (let i = 0; i < incomp.length; i++) {
    let c = incomp[i]
    
    document.getElementById('complete').style['display'] = 'inherit'
    let divm = document.createElement('div')
    divm.className= 'shape'
    divm.id = `t${i}`
    let div = document.createElement('div')
    let icn = document.createElement('i');
    icn.className = 'far fa-check-circle cir';
    icn.setAttribute("onclick",`uncheck('${data[current_list_no]['data'].indexOf(c)}')`);
    div.appendChild(icn)
    let p = document.createElement('p');
    p.textContent = c[0]
    div.append(p)
    divm.setAttribute("onclick",`task_shw('${data[current_list_no]['data'].indexOf(c)}')`);


    hasdue = false;
    if(c[1] != ''){
      hasdue = true;
      let s = document.createElement('span');
      s.className = 'due';
      let icn = document.createElement('i');
      icn.className = 'far fa-calendar-times';
      s.appendChild(icn)
      let t = document.createElement('text');
      let xd = incomp[i][1]
      t.textContent = (`${xd.slice(6,8)}-${xd.slice(4,6)}-${xd.slice(0,4)}`)

      var today = new Date();
      nx = JSON.stringify(today).split('-')
      yn = nx[0].slice(1, 5)
      mn = nx[1]
      dn = nx[2].slice(0, 2)

      if (dn == xd.slice(6,8)){
        if (mn == xd.slice(4,6)){
          if (yn == xd.slice(0,4)){
            s.className = 'due rd';
          }
        }
      }

      var nextDay = new Date();
      nextDay.setDate(today.getDate() + 1);
      nx = JSON.stringify(nextDay).split('-')
      yn = nx[0].slice(1, 5)
      mn = nx[1]
      dn = nx[2].slice(0, 2)

      if (dn == xd.slice(6,8)){
        if (mn == xd.slice(4,6)){
          if (yn == xd.slice(0,4)){
            s.className = 'due rd';
          }
        }
      }

      
      s.appendChild(t)
      div.appendChild(s)
    }

    if(c[2] != ''){
      let s = document.createElement('span');
      s.className = 'notes';
      if (hasdue){
        let d = document.createElement('dot');
        d.className = 'dot';
        d.textContent = ' • '
        div.appendChild(d)
      }
      let icn = document.createElement('i');
      icn.className = 'far fa-sticky-note';
      s.appendChild(icn)
      let t = document.createElement('text');
      t.textContent = (incomp[i][2])
      s.appendChild(t)
      div.appendChild(s)
    }

    divm.appendChild(div);
    document.getElementById('d1-2').appendChild(divm)

  }
  
  load_right()
  auto_grow()
}

function load_right(){
  let curr = data[current_list_no]['data'][current_task_no]
  

  if (curr[3] == false){
    document.getElementById('type_circle').className = 'far fa-circle cir'
  }
  else{
    document.getElementById('type_circle').className = 'far fa-check-circle cir'
  }

  document.getElementById('task').value = curr[0]
  document.getElementById('note').value = curr[2]

  if (curr[1] == ''){
    document.getElementById('date_dis').textContent = ''
    document.getElementById('date_present').style['display'] = 'none'
    document.getElementById('date_absent').style['display'] = 'inherit'
  }
  else{
    document.getElementById('date_present').style['display'] = 'inherit'
    document.getElementById('date_absent').style['display'] = 'none'
    let y = curr[1].slice(0,4)
    let m = curr[1].slice(4,6)
    let d = curr[1].slice(6,8)
    document.getElementById('date').value = `${y}-${m}-${d}`
    chdte()
  }
  auto_grow();
}

SD()



function list_shw(i){
  current_list_no = i
  current_task_no = 0
  load_center()
  for (let k in data[i]) {
    if (k != '_id'){
      load_center((data[i])[k]);
    }
    else{
      let children = document.getElementById('list-items').children;
      for (let c = 0; c < (children.length); c++) {
        (children[c]).className = 'listn'
      }
      document.getElementById((data[i])[k]).className = 'listn selected';
      document.getElementById('up_list').textContent = document.getElementById((data[i])[k]).textContent;
    }
  }

  if (window.innerWidth<=950){
    document.getElementById('left').style['right'] = '100%'
  }
}

function task_shw(i){
  current_task_no = i
  load_right()

  if (window.innerWidth<=600){
    document.getElementById('right').style['left'] = '-60%'
  }
}


function chdte(){
  document.getElementById('date_present').style['display'] = 'inherit'
  document.getElementById('date_absent').style['display'] = 'none'
  let x = document.getElementById('date').value

  if(isNaN(parseInt(x[1]))){
    date_hide();
  }
  x = x.split('-')
  let mnths_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let mnths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let week = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]
  let y = new Date(`${mnths_full[parseInt(x[1])-1]} ${x[2]},${x[0]} 00:00:00`)
  document.getElementById('date_dis').textContent = `${week[y.getDay()]}, ${x[2]}  ${mnths[parseInt(x[1])-1]},  ${x[0]}`;
}

function date_hide(){
  document.getElementById('date_present').style['display'] = 'none'
  document.getElementById('date_absent').style['display'] = 'inherit'
}


function hide(){
  if (document.getElementById("comp-hide").className == 'fas fa-chevron-down'){
    document.getElementById("comp-hide").className = 'fas fa-chevron-right'
    document.getElementById("d1-2").style['display'] = 'none'
  }
  else{
    document.getElementById("comp-hide").className = 'fas fa-chevron-down'
    document.getElementById("d1-2").style['display'] = 'inherit'
  }

}



if (window.innerWidth<=950){
  document.getElementById('lis').style['cursor'] = 'pointer'
  document.getElementById('lis').setAttribute("onclick",`displsylefttab();`)
  document.getElementById('left').style['right'] = '100%'
}

if (window.innerWidth<=600){
  document.getElementById('lis').style['cursor'] = 'pointer'
  document.getElementById('lis').setAttribute("onclick",`displsylefttab();`)
  document.getElementById('right').style['left'] = '40%'
}

function displsylefttab(){
  document.getElementById('left').style['right'] = '0%'
}

function goback(){
  if(window.innerWidth<=600){
    document.getElementById('right').style['left'] = '40%'
  }
}



inp = document.getElementById('new')
inp.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    addnewtask();
  }
});
inp2 = document.getElementById('task')
inp2.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    save_change();
  }
});
inp3 = document.getElementById('note')
inp3.addEventListener("keyup", function(event) {
  if(event.keyCode === 8) {
    element = document.getElementById('note')
    element.style.height = "0px";
    element.style.height = (element.scrollHeight)+"px";
  }
  else if(event.keyCode === 46) {
    element = document.getElementById('note')
    element.style.height = "0px";
    element.style.height = (element.scrollHeight)+"px";
  }
  else{
    element = document.getElementById('note')
    element.style.height = (element.scrollHeight)+"px";
  }
});
inp4 = document.getElementById('new_list')
inp4.addEventListener("keyup", function(event) {
  if(event.keyCode === 13) {
    subpopup()
  }
});






function addnewtask(){ 
  if(data[current_list_no]['data'].length >= 10 && document.getElementById('j_usn').textContent!="meet2005pokar"){
    showToast("Max 10 items per list for Free users");
    return
  }
  if((document.getElementById('new').value).trim()==''){
    return
  }
  data[current_list_no]['data'].push([(document.getElementById('new').value).trim(),'','',false])
  document.getElementById('new').value = ''
  UpdateDatabase();
  load_center(data[current_list_no][document.getElementById('up_list').textContent])
}


function check(i){
  data[current_list_no]['data'][i][3] = true
  UpdateDatabase();
  load_center(data[current_list_no][document.getElementById('up_list').textContent])
}
function uncheck(i){

  data[current_list_no]['data'][i][3] = false
  UpdateDatabase();
  load_center()
  
}

function checkonrt(){
  if(document.getElementById('type_circle').className == 'far fa-circle cir'){
    document.getElementById('type_circle').className = 'far fa-check-circle cir'
    check(current_task_no)
  }
  else{
    document.getElementById('type_circle').className = 'far fa-circle cir'
    uncheck(current_task_no)
  }
  goback()
}



function delete_change(){
  data[current_list_no]['data'].splice(current_task_no,1)
  current_task_no = 0
  UpdateDatabase();
  load_center()
  goback()
}

function save_change(){
  if(document.getElementById('date_present').style['display'] != 'none'){
    d = document.getElementById('date').value.split('-')
    data[current_list_no]['data'][current_task_no][1] = d[0]+d[1]+d[2]
  }
  else{
    data[current_list_no]['data'][current_task_no][1] = ''
  }
  if(document.getElementById('note').value.trim() != ''){
    data[current_list_no]['data'][current_task_no][2] = document.getElementById('note').value.trim()
  }
  if(document.getElementById('task').value.trim() != ''){
    data[current_list_no]['data'][current_task_no][0] = document.getElementById('task').value.trim()
    UpdateDatabase();
    load_center()
  }
  UpdateDatabase();
  load_center()
  goback()
}




function sh_menu(){
  if (document.getElementById('menu').style['display'] == 'none'){
    document.getElementById('menu').style['display'] = 'inherit'
  }
  else{
    document.getElementById('menu').style['display'] = 'none'
  }
}


function del_alltask(){
  sh_menu()
  for (let i =0; i<=data[current_list_no]['data'].length-1;i++){

    if (data[current_list_no]['data'][i][3] == true) {
      data[current_list_no]['data'].splice(i, 1);
      i--; 
    }
  }
  showToast("Deleted");
  UpdateDatabase();
  load_center()
}


function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
function copy_list(){
  sh_menu()
  let output = "";
  data.forEach((list) => {
    output += `\n• ${list.name}\n`;
    list.data.forEach((item) => {
      const [id, date, description, checked] = item;
      output += `\n    ${checked ? "☑" : "☐"} "${id}" | "${date}"\n    ${description}\n`;
    });
  });
  copyToClipboard(output)
  showToast("Copied");
}


function del_list(){
  sh_menu()
  document.getElementById('del_lis_big').style['display'] = 'inherit'
}

function yespopup(){
  document.getElementById('del_lis_big').style['display'] = 'none';
  DeldbList();
}

function add_list_name(){
  document.getElementById('add_lis_big').style['display'] = 'inherit'
  document.getElementById('new_list').focus()
}


function canpopup(){
  document.getElementById('add_lis_big').style['display'] = 'none'
  document.getElementById('del_lis_big').style['display'] = 'none'
}

function subpopup(){
  if(document.getElementById('new_list').value.trim() != ''){
    x = document.getElementById('new_list').value.toString().trim()
    AdddbList(x);
  }
  document.getElementById('new_list').value = ''
  
  document.getElementById('add_lis_big').style['display'] = 'none'
}





async function UpdateDatabase(){

  let bodyContent = new FormData();
  bodyContent.append("token", document.getElementById("uid").textContent.toString());
  bodyContent.append("id", data[current_list_no]['_id']);
  bodyContent.append("new_data",JSON.stringify(data[current_list_no]['data']));
  
  let response = await fetch(uurl+"/update", { 
    method: "POST",
    body: bodyContent
  });
  
  let d = await response.json();

  if(d!="updated"){
    showToast(d);
  }
}

async function AdddbList(name){

  if(data.length >= 3 && document.getElementById('j_usn').textContent!="meet2005pokar"){
    showToast("Max 3 lists allowed for Free users");
    return
  }

  let bodyContent = new FormData();
  bodyContent.append("token", document.getElementById("uid").textContent.toString());
  bodyContent.append("name", name);
  
  let response = await fetch(uurl+"/addlist", { 
    method: "POST",
    body: bodyContent
  });
  
  let d = await response.json();
  if(d!="updated"){
    showToast(d);
  }
  else{
    SD();
  }
}

async function DeldbList(){
  rem_chld = ['d1-1','d1-2']
  for (let ele = 0; ele < (rem_chld.length); ele++) {
    let c = document.getElementById(rem_chld[ele]).lastElementChild;
    while(c){
      document.getElementById(rem_chld[ele]).removeChild(c);
      c = document.getElementById(rem_chld[ele]).lastElementChild;
    }
  }
  document.getElementById('complete').style['display'] = 'none'
  document.getElementById('curlisname').textContent = "My List"


  let bodyContent = new FormData();
  bodyContent.append("token", document.getElementById("uid").textContent.toString());
  
  bodyContent.append("id", data[current_list_no]["_id"]);
  
  let response = await fetch(uurl+"/dellist", { 
    method: "POST",
    body: bodyContent
  });
  
  let d = await response.json();

  if(d!="updated"){
    showToast("not updated");
  }
  else{
    data.splice(current_list_no,1);
    load_left();
  }
}



function search() {
  
  let searchValue = document.getElementById('search').value.trim().toLowerCase();

  
  let allElements = []
  for(let i = 0; i<= document.getElementById('d1-1').children.length;i++){
    allElements.push(document.getElementById('d1-1').children[i])
  }
  for(let i = 0; i<= document.getElementById('d1-2').children.length;i++){
    allElements.push(document.getElementById('d1-2').children[i])
  }

  
  for (let i = 0; i <= allElements.length;i++) {
    if(allElements[i] == undefined){continue}
    let elementText = allElements[i].textContent.toLowerCase()

    
    if (elementText.includes(searchValue)) {
      allElements[i].style.display = 'inherit'; 
      allElements[i].style.visibility = 'visible'; 
    } else {
      allElements[i].style.display = 'none'; 
      allElements[i].style.visibility = 'hidden'; 
    }
  }

  
  let searchIconClass = searchValue !== '' ? 'fas fa-times' : 'fas fa-search';
  document.getElementById('ser').className = searchIconClass;
}

function ser(){
  if(document.getElementById('ser').className == 'fas fa-times'){
    document.getElementById('search').value = ''
    document.getElementById('ser').className = 'fas fa-search'
    let d2c = document.getElementById('d1-2').children
    for (let i = 0; i < d2c.length; i++) {
      document.getElementById(`t${i}`).style['visibility'] = 'visible';
      document.getElementById(`t${i}`).style['display'] = 'inherit';
    }
    let d1c = document.getElementById('d1-1').children
    for (let i = 0; i < d1c.length; i++) {
      document.getElementById(`t${i}`).style['visibility'] = 'visible';
      document.getElementById(`t${i}`).style['display'] = 'inherit';
    }
    if(document.getElementById('d1-2').offsetHeight==0){
      document.getElementById('complete').style['display'] = 'none';
    }
    else{
      document.getElementById('complete').style['display'] = 'inherit';
    }
  }
  else{
    search();
  }
}


if((window.navigator.onLine ? 'on' : 'off') + 'line' == 'offline'){
  document.getElementById('spiral').style['z-index'] = '5000'
  document.getElementById('error').textContent = 'No Internet'

};

window.addEventListener('offline', () => document.getElementById('spiral').style['z-index'] = '5000'); document.getElementById('error').textContent = 'No Internet';
window.addEventListener('online', () => document.getElementById('spiral').style['z-index'] = '-5000'); document.getElementById('error').textContent = 'Loading...';


function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
}


