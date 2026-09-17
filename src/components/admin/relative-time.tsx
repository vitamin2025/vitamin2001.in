export function RelativeTime({ value }: { value: Date }) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return <time dateTime={value.toISOString()}>{formatter.format(value)}</time>;
}
