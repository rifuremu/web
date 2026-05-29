import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';

export default function Home() {
  const navigate = useNavigate();
  const { resetSession } = useSession();

  const handleStart = () => {
    resetSession();
    navigate('/emotion');
  };

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Rifuremu</h1>
      <p className="text-sm text-gray-600">
        このWebアプリでは、入力した内容は保存されません。気軽に試せるPoC版です。
      </p>
      <button
        onClick={handleStart}
        className="bg-gray-800 text-white px-6 py-3 rounded-full font-medium"
        aria-label="新しい感情を記録する"
      >
        新しい感情を記録する
      </button>
    </div>
  );
}
