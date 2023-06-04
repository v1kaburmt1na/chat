import cn from "classnames";
import { Badge } from "react-bootstrap";

export const UserData = (props) => {
  const { user, position } = props;

  const userDataClassname = cn("user-data", {
    'user-data-end': position === 'end'
  });

  return (
    <div className={userDataClassname}>
      <div className="user-data-wrapper">
        <span>ФИО:</span>
        <div className="user-data-inner">
          <Badge>{user.secondName}</Badge>
          <Badge>{user.name}</Badge>
          <Badge>{user.thirdName}</Badge>
        </div>
      </div>
      <div className="user-data-wrapper">
        <span>Отдел:</span>
        <Badge>{user.department}</Badge>
      </div>
      <div className="user-data-wrapper">
        <span>Должность:</span>
        <Badge>{user.post}</Badge>
      </div>
    </div>
  );
};
