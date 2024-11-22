<template>


  <header>
    <div class="title-box">
      <h1 class="green">Links Generator</h1>
      <p>Generate link dari data table.</p>
    </div>
    <div class="actions">
      <button v-if="!isGenerate" @click="upload">Upload</button>
      <input ref="file" v-if="!isGenerate" type="file" name="rawfile" id="rawfile" />
      <button v-if="isGenerate">Generate Short Link</button>
    </div>
  </header>
  <table>
    <thead>
      <tr>
        <th>Email</th>
        <th>Mata Pelajaran</th>
        <th>Pembuat Soal</th>
        <th>Link Soal</th>
        <th>Token Soal</th>
        <th>Keterangan Kelas</th>
      </tr>
    </thead>
    <tbody id="tbody">
      <tr>
        <td>aneh@anu.com</td>
        <td>aneh@anu.com</td>
        <td>aneh@anu.com</td>
        <td>aneh@anu.com</td>
        <td>aneh@anu.com</td>
        <td>aneh@anu.com</td>
      </tr>
    </tbody>
  </table>
</template>


<script setup>



import { ref } from 'vue'
import Swal from 'sweetalert2'
let isGenerate = ref(false)
let file = ref(null)
let dataJSON = []

var ExcelToJSON = function() {

this.parseExcel = function(file) {
  var reader = new FileReader();

  reader.onload = function(e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });
    workbook.SheetNames.forEach(function(sheetName) {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      var json_object = JSON.stringify(XL_row_object);
      dataJSON = JSON.parse(json_object)
      // console.log(dataJSON);
    })
  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
};
};

function createTD(value) {
  var td = document.createElement("td")
  td.appendChild(document.createTextNode(value))
  return td
}

function upload() {
  const files = file.value.files
  if (files.length > 0) {
    const fileExcel = files[0]
    if (fileExcel.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // error
      Swal.fire({
        title: 'Error',
        text: 'Tipe file tidak cocok',
        icon: 'error',
      })
      return
    }

    // Swal.fire('Importing', 'Mengimport file excel...', 'info')
    // Swal.showLoading()
var xl2json = new ExcelToJSON();
xl2json.parseExcel(fileExcel);
setTimeout(() => {
  var tbody = document.getElementById("tbody")
  tbody.childNodes.forEach((tr) => {
    tbody.removeChild(tr)
  })
  dataJSON.forEach(async (dj) => {
    var tr = document.createElement("tr")
    var email = createTD(dj["Email Address"])
    var mapel = createTD(dj["MATA PELAJARAN"])
    var nama = createTD(dj["NAMA PEMBUAT SOAL"])
    var link = createTD(dj["LINK SOAL"])
    var tingkat = createTD(dj["TINGKAT KELAS"])
    var token = createTD(dj["TOKEN SOAL"])
    var ketKelas = createTD(dj["Keterangan kelas"])


    


    tr.appendChild(email)
    tr.appendChild(mapel)
    tr.appendChild(nama)
    tr.appendChild(link)
    tr.appendChild(token)
    tr.appendChild( ketKelas)
    tbody.appendChild(tr)
  })

}, 1000)

  } else {
    Swal.fire({
        title: 'Error',
        text: 'Silahkan pilih file terlebih dahulu!',
        icon: 'error',
      })
  }
}
</script>


<style scoped>

table {
  background-color: white;
  color: #111;
  margin: 1rem auto;
  width: 100%;
  border-radius: 5px;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-weight: bold;
}

th, td {
  /* border: 1px solid #000; */
  padding: .4rem .7rem;
  font-size: 14px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  row-gap: 5px;
}

button,
input {
  background-color: hsla(160, 100%, 37%, 1);
  outline: none;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  margin: 4px;
  cursor: pointer;
  transition: all 0.4s ease;
}

button:hover {
  background-color: rgb(123, 228, 193);
}
</style>
