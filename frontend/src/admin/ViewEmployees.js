import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { columns, statusOptions } from "./tableutils/data";
import { capitalize } from "./tableutils/utils";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PlusIcon } from "./tableutils/PlusIcon";
import { VerticalDotsIcon } from "./tableutils/VerticalDotsIcon";
import { SearchIcon } from "./tableutils/SearchIcon";
import { ChevronDownIcon } from "./tableutils/ChevRonDownIcon";
import axios from "axios";
import BackendURLS from "./../config";
import "./style.View.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner} from "@nextui-org/react";
import exportFromJSON from 'export-from-json'
import * as XLSX from 'xlsx';

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "EmployeeID",
  "EmployeeName",
  "EmployeeDepartment",
  "EmployeeStatus",
  "actions",
];

export default function ViewEmployees() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [users1,setUsers1] = useState([]);
  const [SBox,setSBox] = useState(false)
  const [DBox,setDBox] = useState(false)
  const [empIDS,setEmpIDS] = useState('')
  const [empIDD,setEmpIDD] = useState('')
  // const [profile,setProfile] = useState('')
  
  const [token,setToken] = useState('')
  
  const disableAriaLabelWarning = () => {
    
    const originalWarn = console.warn;
  
    
    console.warn = (...args) => {
      // eslint-disable-next-line
      if (typeof args[0] === 'string' && args[0].includes('aria-label') || args[0].includes('aria-labelledby')) {
        return;
      }
      // originalWarn(...args);
    };
  };
  async function fetchData() {
    try {
      const response = await axios.get(`${BackendURLS.Admin}/viewEmployees`, {
        headers: {
          Authorization: sessionStorage.getItem('AdminToken')
        }
      });
      // Fetch profiles for all users
      const usersWithProfiles = await Promise.all(response.data.map(async (user) => {
        const profile = await getProfile(user.EmployeeID);
        return { ...user, profile }; // Include profile in user object
      }));
      setUsers(usersWithProfiles);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }
  const fetchData1 = async()=>{
    try{
      const response = await axios.get(`${BackendURLS.Admin}/viewEmployees`, {
        headers: {
          Authorization: sessionStorage.getItem('AdminToken')
        }
      });
      setUsers1(response.data)
    }
    catch(e){
      console.log(e.message)
      console.log(e.response.data)
    }
  }
  
  const handleSbox = (empID)=>{
    setSBox(true);
    setEmpIDS(empID)
  }
  const handleDBox = (empID)=>{
    setDBox(true);
    setEmpIDD(empID)
  }
  async function handleStatus(empID){
    try{
      const response = await axios.put(`${BackendURLS.Admin}/changeStatus/${empID}`,null,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      })
      if(response.status === 200){
        setEmpIDS('')
        toast.success("Employee Status Changed!",{theme:'colored'})
        setSBox(false)
        fetchData()
      }
      
    }
    catch(e){
      console.log(e.message)
    }
  }
  async function handleDelete(empID){
    try{

      const response = await axios.delete(`${BackendURLS.Admin}/deleteEmployee/${empID}`,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      })
      if(response.status === 200){
        toast.success("Employee Deleted !",{theme:'colored'})
        setDBox(false)
        fetchData()
      }
    }
    catch(e){
      console.log(e.message)
    }
  }
  const exportToCSV = ()=>{
    // console.log('csv request received')
    const filename = Date.now()
    const exportType = exportFromJSON.types.csv
    exportFromJSON({data:users1,filename,exportType})
  }
  const exportToCSV_A = ()=>{
    // console.log('csv request received')
    const filename = Date.now()
    const activeUsers = users1.filter(user => user.EmployeeStatus === 'Active')
    const exportType = exportFromJSON.types.csv
    exportFromJSON({data:activeUsers,filename:filename,exportType})
  }
  const exportToExcel = ()=>{
    const filename = Date.now()
    const wb = XLSX.utils.book_new()
    const shdata = XLSX.utils.json_to_sheet(users1)
    XLSX.utils.book_append_sheet(wb,shdata,'Sheet-1')
    XLSX.writeFile(wb,"EmployeeData.xlsx")
  }
  const exportToExcel_A = ()=>{
    const filename = Date.now()
    const wb = XLSX.utils.book_new()
    const activeUsers = users1.filter(user => user.EmployeeStatus === 'Active')
    const shdata = XLSX.utils.json_to_sheet(activeUsers)
    XLSX.utils.book_append_sheet(wb,shdata,'Sheet-1')
    XLSX.writeFile(wb,"EmployeeData(Active).xlsx")
  }
  
  useEffect(() => {
    fetchData();
    // setToken(JSON.parse(sessionStorage.getItem('AdminToken')))
    fetchData1();
    disableAriaLabelWarning();
  }, []);
  const getProfile =async(ID)=>{
    // console.log(ID)
    try {
      const response = await axios.get(`${BackendURLS.Admin}/viewProfile/${ID}`, {
          headers: {
              Authorization: sessionStorage.getItem('AdminToken')
          },
          responseType: 'arraybuffer'
      });

      const base64 = btoa(
          new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
          )
      );
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      // console.log(dataUrl);
      return dataUrl;
  } catch (error) {
      console.error('Error fetching profile image:', error);
      return ''; // Return an empty string if there's an error
  }
  }

  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    // Fetch profiles for all users
    const fetchProfiles = async () => {
      const promises = users.map(async (user) => {
        try {
          const response = await axios.get(`${BackendURLS.Admin}/viewProfile/${user.EmployeeID}`, {
            headers: {
              Authorization: sessionStorage.getItem('AdminToken')
            },
            responseType: 'arraybuffer'
          });
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          const dataUrl = `data:image/jpeg;base64,${base64}`;
          return { id: user.EmployeeID, profile: dataUrl };
        } catch (error) {
          console.error(`Error fetching profile for user ${user.EmployeeID}:`, error);
          return { id: user.EmployeeID, profile: '' };
        }
      });
  
      const profilesData = await Promise.all(promises);
      const profilesObj = {};
      profilesData.forEach(({ id, profile }) => {
        profilesObj[id] = profile;
      });
      setProfiles(profilesObj);
    };
  
    fetchProfiles();
  }, [users]);

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (users.length === 0) return []; // Guard against empty users array

    let filteredUsers = [...users];

    if (hasSearchFilter) {
      // console.log(filteredUsers);
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.EmployeeName &&
          user.EmployeeName.toLowerCase().includes(filterValue.toLowerCase())
      );
      // console.log(filteredUsers);
    }
    // console.log(statusFilter)
    // console.log(Array.from(statusFilter).length);
    // console.log(statusOptions.length);

    if (
      statusFilter &&
      Array.from(statusFilter).length > 0 &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.EmployeeStatus &&
          Array.from(statusFilter).includes(user.EmployeeStatus.toLowerCase())
      );
      // console.log(filteredUsers);
      // console.log(filteredUsers);
    }
    // console.log(filteredUsers)
    return filteredUsers;
    // eslint-disable-next-line
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  // console.log(items);
  const sortedItems = useMemo(() => {
    // console.log(items);
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  
  const renderCell = useCallback((user, columnKey) => {
    const profile = profiles[user.EmployeeID];
    // console.log(`../../../backend/${user.EmployeeProfile}`);
    // console.log(profile)
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "EmployeeName":
        return (
          <User
            avatarProps={{
              size: "lg",
              src: user.profile,
            }}
            description={user.EmployeeMailID}
            name={user.EmployeeName}
            
          >
            {user.EmployeeMailID}
          </User>
        );

      case "EmployeeStatus":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.EmployeeStatus.toLowerCase()]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex  items-center gap-2">
            <Dropdown aria-label="VerticalDots">
              <DropdownTrigger>
                <Button aria-label="VerticalDots" isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem  aria-label="View" onClick={()=> navigate(`/admin/viewEmployee/${user.EmployeeID}`)} >View</DropdownItem>
                <DropdownItem aria-label="Edit" onClick={()=>navigate(`/admin/UpdateEmployee/${user.EmployeeID}`)} >Edit</DropdownItem>
                <DropdownItem color ="danger" variant="shadow" aria-label="Delete" onClick={() => handleDBox(user.EmployeeID)} >Delete</DropdownItem>
                <DropdownItem aria-label="Set Status" onClick={() => handleSbox(user.EmployeeID)}>SetStatus</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div>
        <br/>
        <div className="flex flex-col gap-10 ml-2 mt-9">
          <div className="flex justify-between gap-3 items-end">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by name..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <br />
            <div className="flex gap-3 mr-2">
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={true}
                  selectedKeys={statusFilter}
                  selectionMode="multiple"
                  onSelectionChange={setStatusFilter}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {capitalize(status.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {columns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Button color="primary" onClick={()=>navigate(`/admin/addemployee`)} endContent={<PlusIcon />}>
                Add New
              </Button>
              <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    Download
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                <DropdownItem aria-label="Export As CSV(Active)" onClick={exportToCSV_A}  >Export As CSV(Active)</DropdownItem>
                <DropdownItem aria-label="Export as Excel(Active)" onClick={exportToExcel_A} >Export as Excel(Active)</DropdownItem>
                <DropdownItem aria-label="Export as CSV" onClick={exportToCSV} >Export as CSV</DropdownItem>
                <DropdownItem aria-label="Expost as Excel" onClick={exportToExcel} >Export as Excel</DropdownItem>
              </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div
            className="flex justify-between items-center"
            style={{ color: "black" }}
          >
            <span className="text-default-400 text-small">
              Total {users.length} users
            </span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
            style={{backgroundColor:'white'}}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
            style={{backgroundColor:'white'}}
          >
            Next
          </Button>
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  const spinnerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Make the container take up the full viewport height
  };
  
  if (isLoading) {
    // Return the spinner inside a container with the centering styles
    return (
      <div style={spinnerContainerStyle}>
        <Spinner label="Loading..." color="warning" size="lg" />
      </div>
    );
  }
  return (
    <div 
    // style={{backgroundColor:'white'}}
    className="mx-4"
     >
      <Table
        
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        // className="mx-1"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns} >
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {/* {console.log(sortedItems)} */}
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.EmployeeID}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal backdrop={"blur"} isOpen={SBox} onClose={()=>setSBox(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Change Status</ModalHeader>
              <ModalBody>
                <p>Are You Sure you want to change the status of the employee (ID : {empIDS}) ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={()=>handleStatus(empIDS)}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal backdrop={"blur"} isOpen={DBox} onClose={()=>setDBox(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Change Status</ModalHeader>
              <ModalBody>
                <p>Are You Sure you want to Delete employee (ID : {empIDD}) ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={()=>handleDelete(empIDD)}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
