
interface FormHeader {
  title: string;
  subTitle: string;
}

export default function FormHeader({ title, subTitle }: FormHeader) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm">{subTitle}</p>
          </div>
        </div>

      </div>
    </div>
  );
};