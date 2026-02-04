// داخل ملف utils/swalConfig.js
import Swal from 'sweetalert2';

export const MySwal = Swal.mixin({
  background: '#0f172a', // لون الخلفية الداكن الموحد
  color: '#fff',         // لون النص الأبيض
  confirmButtonColor: '#3b82f6', // لون الزر الأزرق
  customClass: {
    popup: 'rounded-3xl border border-slate-800' // حواف دائرية واحترافية
  }
});