export default function BankInfo({ info, className = "" }: { info?: string | null; className?: string }) {
  return (
    <div className={`paper bg-accent-soft p-5 ${className}`}>
      <p className="font-round text-lg">匯款資訊</p>
      {info?.trim() ? (
        <p className="mt-2 whitespace-pre-line font-mono text-[1.05rem]">{info}</p>
      ) : (
        <p className="mt-2 text-muted">匯款資訊將於確認預約時提供。</p>
      )}
      <p className="mt-3 text-sm text-muted">請於確認金額後再匯款，匯款後請以 LINE 告知帳號末 5 碼。</p>
    </div>
  );
}
