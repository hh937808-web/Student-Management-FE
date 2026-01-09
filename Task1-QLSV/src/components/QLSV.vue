<template>
  <div class="demo-container">
    <h2 class="main-title">Hệ Thống Quản Lý Sinh Viên - Students Management System</h2>

    <div class="search-section card">
      <div class="flex-row">
        <input v-model="tuKhoa" @keyup.enter="timKiem" placeholder="Nhập tên hoặc mã sinh viên" class="input-main" />
        <select v-model="locTrangThai" @change="taiDuLieu" class="select-main">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động (ACTIVE)</option>
          <option value="INACTIVE">Nghỉ (INACTIVE)</option>
        </select>
        <button @click="timKiem" class="btn-primary">Tìm kiếm</button>
      </div>
    </div>

    <div class="list-section card">
      <div class="list-header">
        <h4>Danh Sách Sinh Viên</h4>
        <button @click="moModal()" class="btn-success">+ Thêm Sinh Viên</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã Sinh Viên</th>
            <th>Họ và Tên</th>
            <th>Năm Sinh</th>
            <th>Trạng Thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sv in list" :key="sv.id" :class="{ 'row-inactive': sv.status === 'INACTIVE' }">
            <td>{{ sv.id }}</td>
            <td><b>{{ sv.maSV }}</b></td>
            <td>{{ sv.tenSV }}</td>
            <td>{{ sv.ngaySinh }}</td>
            <td>
              <span :class="['badge', sv.status]" @click="doiTrangThai(sv)">
                {{ sv.status }}
              </span>
            </td>
            <td>
              <button class="btn-link yellow" @click="moModal(sv)">Sửa</button>
              <button class="btn-link red" @click="xoa(sv.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list.length" class="no-data">Không tìm thấy dữ liệu.</div>
    </div>

    <div v-if="hienModal" class="overlay">
      <div class="modal-box">
        <h3>{{ form.id ? 'Cập Nhật Hồ Sơ' : 'Thêm Sinh Viên Mới' }}</h3>
        <input v-model="form.maSV" placeholder="Mã SV" :disabled="form.id" class="input-box" />
        <input v-model="form.tenSV" placeholder="Họ và tên" class="input-box" />
        <input v-model="form.ngaySinh" type="number" placeholder="Năm sinh" class="input-box" />
        <input v-model="form.email" placeholder="Email" class="input-box" />

        <div class="modal-btns">
          <button @click="hienModal = false" class="btn-cancel">Hủy</button>
          <button @click="luu" class="btn-save">Lưu thông tin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const list = ref([]), tuKhoa = ref(''), locTrangThai = ref(''), hienModal = ref(false)
const host = "http://localhost:8080/api/students"

const form = ref({ id: null, maSV: '', tenSV: '', ngaySinh: null, email: '', status: 'ACTIVE' })

const taiDuLieu = async () => {
  const url = locTrangThai.value ? `${host}/status/${locTrangThai.value}` : host
  const res = await axios.get(url); list.value = res.data
}

const timKiem = async () => {
  const res = await axios.get(`${host}/search?keyword=${tuKhoa.value}`)
  list.value = Array.isArray(res.data) ? res.data : []

  setTimeout(() => {
    tuKhoa.value = ''
    taiDuLieu()
  }, 3000)
}

const doiTrangThai = async (sv) => {
  const newSt = sv.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  await axios.patch(`${host}/${sv.id}/status?status=${newSt}`)
  taiDuLieu()
}

const luu = async () => {
  try {
    form.value.id ? await axios.put(`${host}/${form.value.id}`, form.value) : await axios.post(host, form.value)
    hienModal.value = false; taiDuLieu()
  } catch (err) {
    alert("Lỗi: Kiểm tra lại mã SV hoặc dữ liệu trống!")
  }
}

const xoa = async (id) => {
  if (confirm("Xác nhận xóa sinh viên này?")) {
    await axios.delete(`${host}/${id}`);
    taiDuLieu()
  }
}

const moModal = (sv = null) => {

  form.value = sv ? { ...sv } : { id: null, maSV: '', tenSV: '', ngaySinh: null, email: '', status: 'ACTIVE' }
  hienModal.value = true
}

onMounted(taiDuLieu)
</script>

<style scoped>
.demo-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f4f7f6;
  min-height: 100vh;
}

.main-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.flex-row {
  display: flex;
  gap: 10px;
}

.input-main,
.select-main {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th {
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #eee;
  color: #7f8c8d;
}

td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.row-inactive {
  background: #f9f9f9;
  color: #bdc3c7;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.badge.ACTIVE {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.INACTIVE {
  background: #ffebee;
  color: #c62828;
}

.btn-link.yellow {
  background: none;
  border: none;
  color: #f1c40f;
  cursor: pointer;
  font-weight: bold;
  margin-right: 10px;
}

.btn-link.red {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
}

.input-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-save {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}
</style>