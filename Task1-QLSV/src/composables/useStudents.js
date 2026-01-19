import { ref } from 'vue';
import { studentApi } from '@/api/studentApi';

export function useStudents() {
  const list = ref([]);
  const isLoading = ref(false);
  const currentPage = ref(1);
  const totalPages = ref(0);

  const fetchPaging = async ({ page, size, status, sort }) => {
    isLoading.value = true;
    try {
      const data = await studentApi.getPaging({ page, size, status, sort });
      list.value = data.content;
      totalPages.value = data.totalPages;
      currentPage.value = page; 
    } finally {
      isLoading.value = false;
    }
  };


  const search = async (keyword) => {
    isLoading.value = true;
    try {
      list.value = await studentApi.search(keyword);
      totalPages.value = 0;
    } finally {
      isLoading.value = false;
    }
  };

  const save = async (student) => {
    student.id
      ? await studentApi.update(student.id, student)
      : await studentApi.create(student);
  };

  const remove = async (id) => {
    await studentApi.delete(id);
  };

  const toggleStatus = async (student) => {
    const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await studentApi.changeStatus(student.id, newStatus);
  };

  return {
    list,
    isLoading,
    currentPage,
    totalPages,
    fetchPaging,
    search,
    save,
    remove,
    toggleStatus
  };
}
