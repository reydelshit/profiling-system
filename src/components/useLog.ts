import axios from 'axios';

export default function useLog(act_what: string, act_type: string) {
  const user_id = localStorage.getItem('profiling_token') as string;
  const handleUploadActivityLog = () => {
    axios
      .post(`${import.meta.env.VITE_PROFILING}/act-log.php`, {
        act_what: act_what,
        act_type: act_type,
        user_id: user_id,
      })
      .then((res) => {
        console.log(res.data, 'ssssss');
      });
  };

  return {
    handleUploadActivityLog,
  };
}
