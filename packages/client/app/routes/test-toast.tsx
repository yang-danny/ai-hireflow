import { showToast } from '~/components/Toast';

export default function TestToast() {
   return (
      <div className="container mx-auto p-8">
         <h1 className="text-2xl font-bold mb-6">Toast Notification Test</h1>

         <div className="flex flex-col gap-4">
            <button
               onClick={() =>
                  showToast.success('Success! This is a success message.')
               }
               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
               Show Success Toast
            </button>

            <button
               onClick={() => showToast.error('Error! Something went wrong.')}
               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
               Show Error Toast
            </button>

            <button
               onClick={() => showToast.warning('Warning! Please be careful.')}
               className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
               Show Warning Toast
            </button>

            <button
               onClick={() => showToast.info('Info! Here is some information.')}
               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
               Show Info Toast
            </button>

            <button
               onClick={() => {
                  const promise = new Promise((resolve) =>
                     setTimeout(() => resolve('Done!'), 2000)
                  );
                  showToast.promise(promise, {
                     loading: 'Loading...',
                     success: 'Promise resolved!',
                     error: 'Promise failed!',
                  });
               }}
               className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
               Show Promise Toast
            </button>
         </div>

         <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h2 className="font-semibold mb-2">Toast Utilities Available:</h2>
            <ul className="list-disc list-inside text-sm">
               <li>
                  <code>showToast.success(message)</code>
               </li>
               <li>
                  <code>showToast.error(message)</code>
               </li>
               <li>
                  <code>showToast.warning(message)</code>
               </li>
               <li>
                  <code>showToast.info(message)</code>
               </li>
               <li>
                  <code>showToast.loading(message)</code>
               </li>
               <li>
                  <code>showToast.promise(promise, messages)</code>
               </li>
               <li>
                  <code>showToast.dismiss(toastId?)</code>
               </li>
            </ul>
         </div>
      </div>
   );
}
