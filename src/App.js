import logo from './logo.svg';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { EditableProTable } from '@ant-design/pro-components';
import TableEditable from './components/TableEditable';
import AvatarUpload from './components/Upload';

function App() {
  return (
    <div className="App">
     {/* <TableEditable></TableEditable> */}
     <AvatarUpload></AvatarUpload>
    </div>
  );
}

export default App;
