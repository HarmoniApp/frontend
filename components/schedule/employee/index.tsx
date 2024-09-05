interface ScheduleEmployeeProps {
    userId: number;
}

const ScheduleEmployee:React.FC<ScheduleEmployeeProps> = ({userId}) => {
  return (
    <div>
      <h1>Schedule Employee {userId}</h1>
    </div>
  );
}
export default ScheduleEmployee;