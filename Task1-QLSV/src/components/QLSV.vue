<template>
  <div class="demo-container">
    <h2 class="main-title">Hệ Thống Quản Lý Sinh Viên - Students Management System</h2>

    <div class="search-section card">
      <div class="flex-row">
        <input 
          v-model="tuKhoa" 
          @input="handleDebounceSearch" 
          placeholder="Nhập tên hoặc mã sinh viên" 
          class="input-main" 
        />
        <select v-model="locTrangThai" @change="taiDuLieu(0)" class="select-main">
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

      <div v-if="isLoading" class="loading-overlay">Đang tải dữ liệu...</div>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Năm Sinh</th>
            <th>Trạng Thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in studentList" :key="student.id" :class="{ 'row-inactive': student.status === 'INACTIVE' }">
            <td>{{ student.id }}</td>
            <td><b>{{ student.maSV }}</b></td>
            <td>{{ student.tenSV }}</td>
            <td>{{ student.ngaySinh }}</td>
            <td>
              <span :class="['badge', student.status]" @click="doiTrangThai(student)">
                {{ student.status }}
              </span>
            </td>
            <td>
              <button class="btn-yellow" @click="moModal(student)">Sửa</button>
              <button class="btn-red" @click="xoa(student.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 0" @click="taiDuLieu(currentPage - 1)" class="btn-page">Trước</button>
        <button v-for="p in totalPages" :key="p" @click="taiDuLieu(p - 1)"
          :class="['btn-page', { active: currentPage === p - 1 }]">
          {{ p }}
        </button>
        <button :disabled="currentPage >= totalPages - 1" @click="taiDuLieu(currentPage + 1)" class="btn-page">Sau</button>
        
        <button @click="nutBamSapXep" class="btn-sort">
          {{ huongSort === 'asc' ? 'Tên: A-Z ↑' : 'Tên: Z-A ↓' }}
        </button>
      </div>
    </div>

    <div v-if="hienModal" class="overlay">
      <div class="modal-box">
        <h3>{{ studentForm.id ? 'Cập Nhật Hồ Sơ' : 'Thêm Sinh Viên Mới' }}</h3>
        <input v-model="studentForm.maSV" placeholder="Mã SV" :disabled="studentForm.id" class="input-box" />
        <input v-model="studentForm.tenSV" placeholder="Họ và tên" class="input-box" />
        <input v-model="studentForm.ngaySinh" type="number" placeholder="Năm sinh" class="input-box" />
        <input v-model="studentForm.email" placeholder="Email" class="input-box" />

        <div class="modal-btns">
          <button @click="hienModal = false" class="btn-cancel">Hủy</button>
          <button @click="luu" class="btn-save" :disabled="isLoading">Lưu thông tin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { studentApi } from '@/api/studentApi';
import { debounce } from '@/utils/helpers';

const studentList = ref([]);
const studentForm = ref({ id: null, maSV: '', tenSV: '', ngaySinh: null, email: '', status: 'ACTIVE' });
const tuKhoa = ref('');
const locTrangThai = ref('');
const hienModal = ref(false);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(5);
const huongSort = ref('asc');
const isLoading = ref(false);

const handleDebounceSearch = debounce(() => {
  if (!tuKhoa.value.trim()) taiDuLieu(0);
  else timKiem();
}, 500);

const taiDuLieu = async (p = 0) => {
  isLoading.value = true;
  try {
    const data = await studentApi.getPaging({
      page: p,
      size: pageSize.value,
      status: locTrangThai.value || null,
      sort: huongSort.value
    });

    studentList.value = data.content;
    totalPages.value = data.totalPages;
    currentPage.value = p;
  } finally {
    isLoading.value = false;
  }
};

const timKiem = async () => {
  isLoading.value = true;
  try {
    const data = await studentApi.search(tuKhoa.value);
    studentList.value = data;
    totalPages.value = 0; 
  } finally {
    isLoading.value = false;
  }
};

const luu = async () => {
  isLoading.value = true;
  try {
    if (studentForm.value.id) {
      await studentApi.update(studentForm.value.id, studentForm.value);
    } else {
      await studentApi.create(studentForm.value);
    }
    hienModal.value = false;
    taiDuLieu(currentPage.value);
  } finally {
    isLoading.value = false;
  }
};

const doiTrangThai = async (student) => {
  const newSt = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  await studentApi.changeStatus(student.id, newSt);
  taiDuLieu(currentPage.value);
};

const xoa = async (id) => {
  if (!confirm("Xác nhận xóa sinh viên này?")) return;
  await studentApi.delete(id);
  taiDuLieu(0);
};

const nutBamSapXep = () => {
  huongSort.value = huongSort.value === 'asc' ? 'desc' : 'asc';
  taiDuLieu(0);
};

const moModal = (data = null) => {
  studentForm.value = data ? { ...data } : { id: null, maSV: '', tenSV: '', ngaySinh: null, email: '', status: 'ACTIVE' };
  hienModal.value = true;
};

onMounted(() => taiDuLieu(0));
</script>

<style scoped>
.btn-sort {
  margin-left: 10px;
  padding: 5px 15px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-sort:hover {
  background: #e67e22;
}

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

.btn-yellow {
  background: #aeae27;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.btn-red {
  background: #ae4427;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
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

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
  align-items: center;
}

.btn-page {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.btn-page.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
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
}

.input-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
.loading-overlay {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #3498db;
}
</style>