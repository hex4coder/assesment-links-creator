<template>
  <header>
    <div class="title-box">
      <h1 class="green">Links Generator</h1>
      <p>Generate link dari data table.</p>
    </div>
    <div class="actions">
      <button v-if="!isGenerate" @click="upload">Upload</button>
      <input ref="file" v-if="!isGenerate" type="file" name="rawfile" id="rawfile" />
      <button @click="generateData">Generate Short Link</button>
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
        <th>Short Link</th>
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
import axios from 'axios'

let isGenerate = ref(false)
let file = ref(null)
let dataJSON = []
var dataExport = []
var ExcelToJSON = function () {
  this.parseExcel = function (file) {
    var reader = new FileReader()

    reader.onload = function (e) {
      var data = e.target.result
      var workbook = XLSX.read(data, {
        type: 'binary',
      })
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
        var json_object = JSON.stringify(XL_row_object)
        dataJSON = JSON.parse(json_object)
        // console.log(dataJSON);
      })
    }

    reader.onerror = function (ex) {
      console.log(ex)
    }

    reader.readAsBinaryString(file)
  }
}

function createTD(value) {
  var td = document.createElement('td')
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
    var xl2json = new ExcelToJSON()
    xl2json.parseExcel(fileExcel)

    setTimeout(() => {
      var tbody = document.getElementById('tbody')
      tbody.childNodes.forEach((tr) => {
        tbody.removeChild(tr)
      })
      dataJSON.forEach(async (dj) => {
        var tr = document.createElement('tr')
        var email = createTD(dj['Email Address'])
        var mapel = createTD(dj['MATA PELAJARAN'])
        var nama = createTD(dj['NAMA PEMBUAT SOAL'])
        var link = createTD(dj['LINK SOAL'])
        var tingkat = createTD(dj['TINGKAT KELAS'])
        var token = createTD(dj['TOKEN SOAL'])
        var ketKelas = createTD(dj['Keterangan kelas'])

        const xauthID = '673fab16a8bbee4492c2b917'
        const xauthKey = 'cm3ruiwav000701n4l48xvf96.BCCmRwmqFX7mJcOT5Okc8AmoSqP9RK1z'

        var dataObject = {
          email: email.innerText,
          nama: nama.innerText,
          long_url: link.innerText,
          kelas: ketKelas.innerText + ' / ' + tingkat.innerText,
          mapel: mapel.innerText,
          short: '',
        }

        tr.appendChild(email)
        tr.appendChild(mapel)
        tr.appendChild(nama)
        tr.appendChild(link)
        tr.appendChild(token)
        tr.appendChild(ketKelas)

        var myHeaders = new Headers()
        myHeaders.append('X-Auth-Id', xauthID)
        myHeaders.append('X-Auth-Key', xauthKey)
        myHeaders.append('Content-Type', 'application/json')



        try {
          var req = await axios.post(
            'http://localhost:5000/',
            { long_url: dataObject.long_url },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Auth-Id': xauthID,
                'X-Auth-Key': xauthKey,
              },
            }
          )
          var r = (req.data)
          console.log(r)
          if (r.code == 200) {
            tr.appendChild(createTD(r.short))
            tbody.appendChild(tr)
            dataObject.short = r.short
            console.log(dataObject)
            dataExport.push(dataObject)
          }
        } catch (error) {
          console.error('error post data', dataObject, req, error)
        }
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

// generate data
async function generateData() {
  var exampledata = [
    {
        "email": "masdaliaspd95@guru.smk.belajar.id",
        "nama": "MASDALIA",
        "long_url": "https://s.id/8g8GH",
        "kelas": "KELAS IX MPLB / KELAS XI",
        "mapel": "MAPEL PILIHAN MPLB",
        "short": "https://s.id/8g8GH"
    },
    {
        "email": "faisaltanjung53@guru.smk.belajar.id",
        "nama": "Bakhtiar, S.Pd",
        "long_url": "https://forms.gle/W6yin7tWNUd5oTZH9",
        "kelas": "Kelas X TO / KELAS X",
        "mapel": "DDTO",
        "short": "https://forms.gle/W6yin7tWNUd5oTZH9"
    },
    {
        "email": "suardispd46@guru.smk.belajar.id",
        "nama": "SUARDI, S.Pd",
        "long_url": "https://forms.gle/5MgMiztw7ywoeAjZ7",
        "kelas": "KELAS XI TO 1, KELAS XI TO 2 / KELAS XI",
        "mapel": "MAPEL KONSENTRASI KEAHLIAN TEKNIK OTOMOTIF",
        "short": "https://forms.gle/5MgMiztw7ywoeAjZ7"
    },
    {
        "email": "taufiqs20@guru.smk.belajar.id",
        "nama": "TAUFIQ S",
        "long_url": "https://forms.gle/Tff5S3iF9aJNsqiB6",
        "kelas": "KELAS X SEMUA JURUSAN / KELAS X",
        "mapel": "PENDIDIKAN AGAMA ISLAM",
        "short": "https://forms.gle/Tff5S3iF9aJNsqiB6"
    },
    {
        "email": "ardan43@guru.smk.belajar.id",
        "nama": "ARDAN, S.KOM",
        "long_url": "https://forms.gle/ZSHwPwuhrfyNxzyt9",
        "kelas": "KELAS X SEMUA JURUSAN / KELAS X",
        "mapel": "INFORMATIKA",
        "short": "https://forms.gle/ZSHwPwuhrfyNxzyt9"
    },
    {
        "email": "unianatasya04@guru.smk.belajar.id",
        "nama": "UNI ANATASYA",
        "long_url": "https://forms.gle/FNLvQXdQ7m122J7E8",
        "kelas": "X DKV / KELAS X",
        "mapel": "DASAR-DASAR PROGRAM KEAHLIAN DESAIN KOMUNIKASI VISUAL",
        "short": "https://forms.gle/FNLvQXdQ7m122J7E8"
    },
    {
        "email": "unianatasya04@guru.smk.belajar.id",
        "nama": "UNI ANATASYA, S.Kom",
        "long_url": "https://forms.gle/KiCzdVyaLxxKJ3U38",
        "kelas": "XI TJKT / KELAS XI",
        "mapel": "PROJECT KREATIF KEWIRAUSAHAAN",
        "short": "https://forms.gle/KiCzdVyaLxxKJ3U38"
    },
    {
        "email": "nisrawati27@guru.smk.belajar.id",
        "nama": "NISRAWATI,S.Pd.I",
        "long_url": "https://s.id/opsQI",
        "kelas": "kELAS XI SEMUA KELAS / KELAS XI",
        "mapel": "PENDIDIKAN AGAMA DAN BUDI PEKERTI",
        "short": "https://s.id/opsQI"
    },
    {
        "email": "amriani14@guru.smk.belajar.id",
        "nama": "AMRIANI",
        "long_url": "https://forms.gle/31RSBJ1fjWMx9Gm59",
        "kelas": "KELAS XI AKL / KELAS XI",
        "mapel": "MAPEL PILIHAN ",
        "short": "https://forms.gle/31RSBJ1fjWMx9Gm59"
    },
    {
        "email": "abriantoyasin00@guru.smk.belajar.id",
        "nama": "ABRIANTO YASIN",
        "long_url": "https://forms.gle/a3k6PQiuMHaKvyVh7",
        "kelas": "KELAS X SEMUA KELAS  / KELAS X",
        "mapel": "BAHASA INDONESIA ",
        "short": "https://forms.gle/a3k6PQiuMHaKvyVh7"
    },
    {
        "email": "sukmanmamat@gmail.com",
        "nama": "NURLINAH, S.Pd",
        "long_url": "https://forms.gle/Re7HM65G31pnxSgm7",
        "kelas": "KELAS X SEMUA JURUSAN / KELAS X",
        "mapel": "PJOK KELAS X",
        "short": "https://forms.gle/Re7HM65G31pnxSgm7"
    },
    {
        "email": "sukmanmamat@gmail.com",
        "nama": "MUHAMMAD ILYAS, S.Pd.",
        "long_url": "https://forms.gle/r4SS1nCe4nJo84xY9",
        "kelas": "SEMUA KELAS XI / KELAS XI",
        "mapel": "PJOK KELAS XI",
        "short": "https://forms.gle/r4SS1nCe4nJo84xY9"
    },
    {
        "email": "ardan43@guru.smk.belajar.id",
        "nama": "USMAN. A, S.Kom",
        "long_url": "https://forms.gle/4YYqSmTRambBsVc66",
        "kelas": "Untuk kelas X TJKT 1 dan X TJKT 2 / KELAS X",
        "mapel": "DASAR PROGRAM KEAHLIAN TJKT (DPKTJKT)",
        "short": "https://forms.gle/4YYqSmTRambBsVc66"
    },
    {
        "email": "hasbia52@guru.smk.belajar.id",
        "nama": "Hasbia, S.Kom & Uni Anatasya, S. Kom",
        "long_url": "https://s.id/b8LE9",
        "kelas": "XI DKV / KELAS XI",
        "mapel": "Mapel Konsentrasi Keahlian DKV",
        "short": "https://s.id/b8LE9"
    },
    {
        "email": "miftahuljanna70@guru.smk.belajar.id",
        "nama": "MIFTAHUL JANNA,S.Pd",
        "long_url": "https://forms.gle/jig4wSCF7GSi8egD8",
        "kelas": "Kelas XI TJKT / KELAS XI",
        "mapel": "KONSENTRASI KEAHLIAN XI TJKT",
        "short": "https://forms.gle/jig4wSCF7GSi8egD8"
    },
    {
        "email": "miftahuljanna70@guru.smk.belajar.id",
        "nama": "MIFTAHUL JANNA, S.Pd",
        "long_url": "https://s.id/mq9ur",
        "kelas": "Kelas XI TJKT / KELAS XI",
        "mapel": "MAPEL PILIHAN ",
        "short": "https://s.id/mq9ur"
    },
    {
        "email": "judesliantiamran02@guru.smk.belajar.id",
        "nama": "Harliana, S.Pd., Gr",
        "long_url": "https://forms.gle/wxKFvJdmasjgMXA16",
        "kelas": "Semua Kelas XI / KELAS XI",
        "mapel": "Bahasa Inggris",
        "short": "https://forms.gle/wxKFvJdmasjgMXA16"
    },
    {
        "email": "novia593@guru.smk.belajar.id",
        "nama": "NOVIA, S.Pd",
        "long_url": "https://docs.google.com/forms/d/e/1FAIpQLScodBZ_mzf89ouJP-kLRTPS34Lg-ds46GH2d9T4nZwttod9tg/viewform?usp=sf_link",
        "kelas": "kelas X MPLB / KELAS X",
        "mapel": "DASAR DASAR PROGRAM KEAHLIAN MPLB",
        "short": "https://docs.google.com/forms/d/e/1FAIpQLScodBZ_mzf89ouJP-kLRTPS34Lg-ds46GH2d9T4nZwttod9tg/viewform?usp=sf_link"
    },
    {
        "email": "miftahuljanna70@guru.smk.belajar.id",
        "nama": "MIFTAHUL JANNA, S.Pd",
        "long_url": "https://forms.gle/eGU6aHR92ESoQ5ZVA",
        "kelas": "KELAS XI DKV / KELAS XI",
        "mapel": "MAPEL PILIHAN DKV",
        "short": "https://forms.gle/eGU6aHR92ESoQ5ZVA"
    },
    {
        "email": "miftahuljanna70@guru.smk.belajar.id",
        "nama": "MIFTAHUL JANNA, S.Pd",
        "long_url": "https://s.id/b8LE9",
        "kelas": "KELAS XI TJKT / KELAS XI",
        "mapel": "MAPEL PILIHAN ",
        "short": "https://s.id/b8LE9"
    },
    {
        "email": "hasbia52@guru.smk.belajar.id",
        "nama": "HASBIA, S.Kom",
        "long_url": "-",
        "kelas": "XI DKV / KELAS XI",
        "mapel": "PROJEK KREATIF DAN KEWIRAUSAHAAN",
        "short": "-"
    },
    {
        "email": "asriahmardinfausi@gmail.com",
        "nama": "ASRIAH MARDIN",
        "long_url": "https://forms.gle/vfT49booKEDRg6xB8",
        "kelas": "SEMUA KELAS X  ( X TJKT1, X TJKT 2, X TO, X BUSANA 1, X BUSANA 2, X DKV, X MPLB, X AKL) / KELAS X",
        "mapel": "MATEMATIKA",
        "short": "https://forms.gle/vfT49booKEDRg6xB8"
    },
    {
        "email": "amt83@guru.smk.belajar.id",
        "nama": "A.REZKI TAPPAWALI, S.Pd,.Gr",
        "long_url": "https://forms.gle/seFzCHBJH4q7EwsC7",
        "kelas": "Kelas XI Semua Kelas / KELAS XI",
        "mapel": "BAHASA INDONESIA",
        "short": "https://forms.gle/seFzCHBJH4q7EwsC7"
    },
    {
        "email": "anita99@guru.smk.belajar.id",
        "nama": "ANITA, S.Pd",
        "long_url": "https://forms.gle/HxPVvgkD2dKhYgfd6",
        "kelas": "Kelas XI Semua Kelas / KELAS XI",
        "mapel": "MATEMATIKA",
        "short": "https://forms.gle/HxPVvgkD2dKhYgfd6"
    },
    {
        "email": "muha96@guru.smk.belajar.id",
        "nama": "Muh. Yusuf A, SH",
        "long_url": "https://forms.gle/RN1TUQ8pEfp5oaqW8",
        "kelas": "Kelas XI semua kelas / KELAS XI",
        "mapel": "Pendidikan Pancasila",
        "short": "https://forms.gle/RN1TUQ8pEfp5oaqW8"
    },
    {
        "email": "faisaltanjung53@guru.smk.belajar.id",
        "nama": "Faisal Tanjung, S.Pd",
        "long_url": "-",
        "kelas": "Semua Kelas XI Teknik Otomotif / KELAS XI",
        "mapel": "PKK Teknik Otomotif",
        "short": "-"
    },
    {
        "email": "faisaltanjung53@guru.smk.belajar.id",
        "nama": "Drs Nasri M",
        "long_url": "https://forms.gle/khu6q9C9XVSxisr86",
        "kelas": "TO kelas XI / KELAS XI",
        "mapel": "Mapel Pilihan Teknik Otomotif kelas XI",
        "short": "https://forms.gle/khu6q9C9XVSxisr86"
    },
    {
        "email": "rahmatsuar@gmail.com",
        "nama": "Rahmat",
        "long_url": "https://forms.gle/JZR1SrBj6ntHoJhf6",
        "kelas": "semua kelas X / KELAS X",
        "mapel": "Seni Budaya",
        "short": "https://forms.gle/JZR1SrBj6ntHoJhf6"
    },
    {
        "email": "muha96@guru.smk.belajar.id",
        "nama": "Muh. Yusuf A, SH",
        "long_url": "https://forms.gle/NRb4bFd85MwM5ETf9",
        "kelas": "Kelas XI semua Kelas / KELAS X",
        "mapel": "Pendidikan Pancasila",
        "short": "https://forms.gle/NRb4bFd85MwM5ETf9"
    },
    {
        "email": "arminpatamorgana081@guru.smk.belajar.id",
        "nama": "ARMIN PATAMORGANA, S.Pd,.Gr",
        "long_url": "https://forms.gle/u2Zxz6aPA4Y9MPij6",
        "kelas": "Kelas X Semua Jurusan / KELAS X",
        "mapel": "BAHASA INGGRIS",
        "short": "https://forms.gle/u2Zxz6aPA4Y9MPij6"
    },
    {
        "email": "nurhasdiana32@guru.smk.belajar.id",
        "nama": "NURHASDIANA.SE",
        "long_url": "https://forms.gle/DobMskGaqmEuM3Zg8",
        "kelas": "kelas XI AKL / KELAS XI",
        "mapel": "KONSENTRANSI KEAHLIAN AKL",
        "short": "https://forms.gle/DobMskGaqmEuM3Zg8"
    },
    {
        "email": "nurhasdiana32@guru.smk.belajar.id",
        "nama": "YUSRI TAUWAL.SE",
        "long_url": "https://forms.gle/56Mzith3GSdEJSK77",
        "kelas": "X AKL / KELAS X",
        "mapel": "DASAR-DASAR AKUNTANSI DAN KEUANGAN LEMBAGA",
        "short": "https://forms.gle/56Mzith3GSdEJSK77"
    },
    {
        "email": "hasriatihasa@gmail.com",
        "nama": "HASRIATI HASAN ",
        "long_url": "https://docs.google.com/forms/d/e/1FAIpQLSeqrVMRqZfoi5418qUnkBUSPlLHhwG8TtxKaZavyhQauGok2w/viewform",
        "kelas": "Kelas X BUSANA SEMUA / KELAS X",
        "mapel": "DASAR-DASAR BUSANA ",
        "short": "https://docs.google.com/forms/d/e/1FAIpQLSeqrVMRqZfoi5418qUnkBUSPlLHhwG8TtxKaZavyhQauGok2w/viewform"
    },
    {
        "email": "nanda782@guru.smk.belajar.id",
        "nama": "Kurnia, S.Ag,. M.Pd i",
        "long_url": "https://forms.gle/dyivQajt2r254W4s5",
        "kelas": "Semua kelas X / KELAS X",
        "mapel": "SEJARAH INDONESIA ",
        "short": "https://forms.gle/dyivQajt2r254W4s5"
    },
    {
        "email": "nurpadilah64@guru.smk.belajar.id",
        "nama": "NURPADILAH S.Pd",
        "long_url": "https://docs.google.com/forms/d/e/1FAIpQLSfDkq5ICWLkS2Dl-V_dBKZeuP6aweBSgWQMOe1qvzsstvJC5A/viewform?usp=sharing",
        "kelas": "XI MPLB / KELAS XI",
        "mapel": "MATA PELAJARAN KONSENTRASI KEAHLIAN MPLB",
        "short": "https://docs.google.com/forms/d/e/1FAIpQLSfDkq5ICWLkS2Dl-V_dBKZeuP6aweBSgWQMOe1qvzsstvJC5A/viewform?usp=sharing"
    },
    {
        "email": "padliani11@guru.smk.belajar.id",
        "nama": "PADLIANI",
        "long_url": "https://forms.gle/5cJyns16xzcZ5ZZu6",
        "kelas": "SEMUA KELAS XI TATA BUSANA / KELAS XI",
        "mapel": "Mapel Pilihan TATA BUSANA",
        "short": "https://forms.gle/5cJyns16xzcZ5ZZu6"
    }
]


      var filename='reports-exported.xlsx';
       var data=exampledata

       if(dataExport.length > 0) {
        data = dataExport
       }

       var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "LINKSOAL");
        XLSX.writeFile(wb,filename);

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

th,
td {
  /* border: 1px solid #000; */
  padding: 0.4rem 0.7rem;
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
