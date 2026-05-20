export default function Mark({ size = 36, ...rest }) {
  return (
    <img
      src="/assets/logo-tpm.png"
      alt="TPM · Todas Para o Mar"
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain" }}
      {...rest}
    />
  );
}
