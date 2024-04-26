const columns = [
  { name: "ID", uid: "EmployeeID", sortable: true },
  { name: "NAME", uid: "EmployeeName", sortable: true },
  { name: "AGE", uid: "EmployeeAge", sortable: true },
  { name: "EMAIL", uid: "EmployeeMailID" },
  { name: "DEPARTMENT", uid:"EmployeeDepartment"},
  { name: "Mobile.No", uid:"EmployeeContact"},
  { name: "STATUS", uid: "EmployeeStatus", sortable: true },
  { name: "ACTIONS", uid: "actions" }, // Update this according to your actual requirements
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "InActive", uid: "inactive" },
];
export { columns, statusOptions };
