import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

type ActivityLogType = {
  act_id: number;
  act_what: string;
  act_type: string;
  user_id: number;
  created_at: string;
  ip_address: string;
};

const ActivityLog = () => {
  const [activityLog, setActivityLog] = useState<ActivityLogType[]>([]);

  const user_id = localStorage.getItem('profiling_token') as string;

  const fetchActivityLog = () => {
    console.log(user_id, 'user_id');
    axios
      .get(`${import.meta.env.VITE_PROFILING}/act-log.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data, 'ssssss');
        setActivityLog(res.data);
      });
  };

  useEffect(() => {
    fetchActivityLog();
  }, []);

  return (
    <div className="px-[5rem]">
      <h1 className="text-4xl my-10">Activity log</h1>

      <div className="flex gap-2 justify-between w-full">
        <div className="flex h-screen items-start flex-col justify-start w-full  bg-white px-2">
          <h1 className="text-2xl my-2 font-semibold">
            Login and Logout Activity (only shows latest 10 logs)
          </h1>
          <div className="space-y-6 border-l-2 border-dashed">
            {activityLog.length > 0 ? (
              activityLog
                .filter(
                  (log) =>
                    log.act_type.toLowerCase().includes('login') ||
                    log.act_type.toLowerCase().includes('logout'),
                )
                .map((log, index) => {
                  return (
                    <div key={index} className="relative w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-[#1A4D2E]"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-6">
                        <h4 className="font-bold text-[#1A4D2E]">
                          {log.act_type.toUpperCase()}
                        </h4>
                        <p className="mt-2 max-w-screen-sm text-sm text-gray-500">
                          {log.act_what}
                        </p>
                        <span className="mt-1 block text-sm font-semibold text-[#1A4D2E]">
                          {moment(log.created_at).format('lll')}
                        </span>
                      </div>
                    </div>
                  );
                })
                .slice(0, 10)
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-gray-500">No activity log found</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex h-screen items-start flex-col justify-start w-full  bg-white px-2">
          <h1 className="text-2xl my-2 font-semibold">
            System Activity (only shows latest 10 logs)
          </h1>
          <div className="space-y-6 border-l-2 border-dashed">
            {activityLog.length > 0 ? (
              activityLog
                .filter(
                  (log) =>
                    !log.act_type.toLowerCase().includes('login') &&
                    !log.act_type.toLowerCase().includes('logout'),
                )
                .map((log, index) => {
                  return (
                    <div key={index} className="relative w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-[#1A4D2E]"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-6">
                        <h4 className="font-bold text-[#1A4D2E]">
                          {log.act_type.toUpperCase()}
                        </h4>
                        <p className="mt-2 max-w-screen-sm text-sm text-gray-500">
                          {log.act_what}
                        </p>
                        <span className="mt-1 block text-sm font-semibold text-[#1A4D2E]">
                          {moment(log.created_at).format('lll')}
                        </span>
                      </div>
                    </div>
                  );
                })
                .slice(0, 10)
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-gray-500">No activity log found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
