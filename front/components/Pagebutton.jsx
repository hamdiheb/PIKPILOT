export default function Pagebutton(props) {
  const { value, label, isActive, disabled, setCurrentPage } = props
  return (
    <button
      value={value}
      disabled={disabled}
      className={`font-archivo flex h-[38px] min-w-[38px] items-center justify-center border border-solid px-[10px] text-[12px] font-extrabold tracking-[0.08em] uppercase transition-colors duration-200 ${
        isActive
          ? 'cursor-default border-[#201E1D] bg-[#201E1D] text-[#F5F2F0]'
          : disabled
            ? 'cursor-not-allowed border-[#D6D0CA] text-[#B8B2AC]'
            : 'cursor-pointer border-[#201E1D] text-[#201E1D] hover:border-[#EC3013] hover:bg-[#EC3013] hover:text-[#F5F2F0]'
      }`}
      onClick={(event) => {
        setCurrentPage(parseInt(event.currentTarget.value))
      }}
    >
      {label ?? value}
    </button>
  )
}
