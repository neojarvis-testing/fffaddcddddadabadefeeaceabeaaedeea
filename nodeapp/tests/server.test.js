const userController = require('../controllers/userController');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const mongoose = require('mongoose'); 
const {getAllEmployees,getEmployeeById,registerEmployee,editEmployee,deleteEmployee,getEmployeeByUserId} = require('../controllers/employeeController');
const {getUserByUsernameAndPassword,addUser,getAllUsers} = require('../controllers/userController');

describe('getUserByUsernameAndPassword', () => {


    test('getuserbyusernameandpassword_should_return_invalid_credentials_with_a_200_status_code', async () => {
      // Sample user credentials
      const userCredentials = {
        email: 'nonexistent@example.com',
        password: 'incorrect_password',
      };
  
      // Mock Express request and response objects
      const req = {
        body: userCredentials,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the User.findOne method to resolve with null (user not found)
      User.findOne = jest.fn().mockResolvedValue(null);
  
      // Call the controller function
      await userController.getUserByUsernameAndPassword(req, res);
  
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith(userCredentials);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });
  
    test('getuserbyusernameandpassword_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling User.findOne
      const error = new Error('Database error');
  
      // Sample user credentials
      const userCredentials = {
        email: 'john@example.com',
        password: 'password123',
      };
  
      // Mock Express request and response objects
      const req = {
        body: userCredentials,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the User.findOne method to reject with an error
      User.findOne = jest.fn().mockRejectedValue(error);
  
      // Call the controller function
      await userController.getUserByUsernameAndPassword(req, res);
  
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith(userCredentials);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('addUser', () => {
    test('adduser_should_add_user_and_respond_with_a_200_status_code_and_success_message', async () => {
      // Sample user data
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
      };
  
      // Mock Express request and response objects
      const req = {
        body: userData,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the User.create method to resolve with the sample user data
      User.create = jest.fn().mockResolvedValue(userData);
  
      // Call the controller function
      await userController.addUser(req, res);
  
      // Assertions
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
    });
  
    test('adduser_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling User.create
      const error = new Error('Database error');
  
      // Mock Express request and response objects
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the User.create method to reject with an error
      User.create = jest.fn().mockRejectedValue(error);
  
      // Call the controller function
      await userController.addUser(req, res);
  
      // Assertions
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
  
  describe('getAllUsers', () => {
    test('getallusers_should_return_users_and_respond_with_a_200_status_code', async () => {
      // Sample user data
      const usersData = [
        {
          _id: 'user1',
          username: 'john_doe',
          email: 'john@example.com',
          password: 'hashed_password1',
        },
        {
          _id: 'user2',
          username: 'jane_doe',
          email: 'jane@example.com',
          password: 'hashed_password2',
        },
      ];
  
      // Mock Express request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the User.find method to resolve with the sample user data
      User.find = jest.fn().mockResolvedValue(usersData);
  
      // Call the controller function
      await userController.getAllUsers(req, res);
  
      // Assertions
      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({"users" : usersData});
    });
  
    test('getallusers_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling User.find
      const error = new Error('Database error');
  
      // Mock Express request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the User.find method to reject with an error
      User.find = jest.fn().mockRejectedValue(error);
  
      // Call the controller function
      await userController.getAllUsers(req, res);
  
      // Assertions
      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
  
  describe('User Model Schema Validation', () => {
    test('should_validate_a_user_with_valid_data', async () => {
      const validUserData = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        email: 'johndoe@example.com',
        role: 'Admin',
        password: 'validpassword',
      };
  
      const user = new User(validUserData);
  
      // Validate the user data against the schema
      await expect(user.validate()).resolves.toBeUndefined();
    });
  
    test('should_validate_a_user_with_missing_required_fields', async () => {
      const invalidUserData = {
        // Missing required fields
      };
  
      const user = new User(invalidUserData);
  
      // Validate the user data against the schema
      await expect(user.validate()).rejects.toThrowError();
    });
  
    test('should_validate_a_user_with_invalid_mobile_number_format', async () => {
      const invalidUserData = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: 'not-a-number',
        email: 'johndoe@example.com',
        role: 'user',
        password: 'validpassword',
      };
  
      const user = new User(invalidUserData);
  
      // Validate the user data against the schema
      await expect(user.validate()).rejects.toThrowError(/is not a valid mobile number/);
    });
  
    test('should_validate_a_user_with_invalid_email_format', async () => {
      const invalidUserData = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        email: 'invalid-email',
        role: 'user',
        password: 'validpassword',
      };
  
      const user = new User(invalidUserData);
  
      // Validate the user data against the schema
      await expect(user.validate()).rejects.toThrowError(/is not a valid email address/);
    });
  
    test('should_validate_a_user_with_a_password_shorter_than_the_minimum_length', async () => {
      const invalidUserData = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        email: 'johndoe@example.com',
        role: 'Admin',
        password: 'short',
      };
  
      const user = new User(invalidUserData);
  
      // Validate the user data against the schema
      await expect(user.validate()).rejects.toThrowError(/Password must be at least 8 characters long/);
    });
  
    test('should_validate_a_user_with_a_password_longer_than_the_maximum_length', async () => {
      const invalidUserData = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        email: 'johndoe@example.com',
        role: 'Admin',
        password: 'a'.repeat(256),
      };
  
      const user = new User(invalidUserData);
  
      // Validate the user data against the schema
      await expect(user.validate()).rejects.toThrowError(/Password must be at most 32 characters long/);
    });
  });

  describe('Employee Model Schema Validation', () => {

    test('should_validate_a_employee_with_valid_data', async () => {
      const validEmployeeData = {
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '1234567890',
        mailId: 'doe@gmail.com',
        dateOfBirth:'1998-01-01',
        age:'22',
        gender:'male',
        education:'BE',
        experience:'1',
        userId: new mongoose.Types.ObjectId(),
        };

        const employee = new Employee(validEmployeeData);
        await expect(employee.validate()).resolves.toBeUndefined();
        });

    test('should_throw_validation_error_without_required_fields', async () => {
        const invalidEmployeeData = {
            // Missing required fields
        };
    
        const employee = new Employee(invalidEmployeeData);
        await expect(employee.validate()).rejects.toThrowError();
        });

    test('should_throw_validation_error_with_invalid_mobile_number_format', async () => {
        const invalidEmployeeData = {
            firstName: 'John',
            lastName: 'Doe',
            mobileNumber: 'not-a-number',
            mailId: 'invalid-email',
            dateOfBirth:'1998-01-01',
            age:'22',
            gender:'male',
            education:'BE',
            experience:'1',
            userId: 'invalid-user-id',
        };

        const employee = new Employee(invalidEmployeeData);
        await expect(employee.validate()).rejects.toThrowError(/is not a valid mobile number/);
        });

  });


describe('getAllEmployeesController', () => {

    test('getallemployees_should_return_employees_and_respond_with_a_200_status_code', async () => {
        // Sample employee data
        const employeesData = [
          {
            firstName: 'John',
            lastName: 'Doe',
            mobileNumber: '1234567890',
            mailId: 'doe@gmail.com',
            dateOfBirth:'1998-01-01',
            age:'22',
            gender:'male',
            education:'BE',
            experience:'1',
            userId: new mongoose.Types.ObjectId(),
          },
        {
            firstName: 'Abisha',
            lastName: 'Ab',
            mobileNumber: '1234567890',
            mailId: 'abi@gmail.com',
            dateOfBirth:'1998-01-01',
            age:'24',
            gender:'female',
            education:'BE',
            experience:'5',
            userId: new mongoose.Types.ObjectId(),
        },
        ];

        // Mock Express request and response objects
        const req = {
            body:{ sortValue: 1, searchValue: 'John' },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the Employee.find method to resolve with the sample employee data
        const employeeQuery = {
            sort: jest.fn().mockResolvedValue(employeesData),
        };
        Employee.find = jest.fn(() => employeeQuery);

        // Call the controller function
        await getAllEmployees(req, res);

        // Assertions
        expect(Employee.find).toHaveBeenCalledWith({firstName: new RegExp('John', 'i')});
        expect(employeeQuery.sort).toHaveBeenCalledWith({experience: 1});
        expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({employees: employeesData});
        expect(res.json).toHaveBeenCalledWith({data: employeesData});
    });

    test('getallemployees_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
        // Mock an error to be thrown when calling Employee.find
        const error = new Error('Database error');

        // Mock Express request and response objects
        const req = {
            body:{ sortValue: 1, searchValue: 'John' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the Employee.find method to reject with an error
        const employeeQuery = {
            sort: jest.fn().mockRejectedValue(error),
        };
        Employee.find = jest.fn().mockReturnValue(employeeQuery);

        // Call the controller function
        await getAllEmployees(req, res);

        // Assertions
        expect(Employee.find).toHaveBeenCalledWith({ firstName: new RegExp('John', 'i') });
        expect(employeeQuery.sort).toHaveBeenCalledWith({experience: 1});   
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

});


describe('registerEmployeeController', () => {
  test('registeremployee_should_add_employee_and_respond_with_a_200_status_code_and_success_message', async () => {
      // Sample employee data
      const employeeData = {
          firstName: 'John',
          lastName: 'Doe',
          mobileNumber: '1234567890',
          mailId: 'john@gmail.com',
          dateOfBirth:'1998-01-01',
          age:'22',
          gender:'male',
          education:'BE',
          experience:'1',
          userId: new mongoose.Types.ObjectId(),
      };

      // Mock Express request and response objects
      Employee.create = jest.fn().mockResolvedValue(employeeData);
      const req = {
          body: employeeData,
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Call the controller function
      await registerEmployee(req, res);

      // Assertions
      expect(Employee.create).toHaveBeenCalledWith(employeeData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee registration successful' });
  });

  test('registeremployee_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Employee.create
      const error = new Error('Database error');

      // Mock Express request and response objects
      Employee.create = jest.fn().mockRejectedValue(error);

      const req = {
          body: {},
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Call the controller function
      await registerEmployee(req, res);

      // Assertions
      expect(Employee.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });

});

describe('updateEmployeeController', () => {

  test('updateemployee_should_update_employee_and_respond_with_a_200_status_code_and_success_message', async () => {

      // Sample employee data
      const employeeId = new mongoose.Types.ObjectId();
      const updateEmployeeData = {
          firstName: 'UpdatedJohn',
          lastName: 'Doe',
          mobileNumber: '1234567890',
          mailId: 'update@gmail.com',
          dateOfBirth:'1998-01-01',
          age:'22',
          gender:'male',
          education:'BE',
          experience:'1',
          userId: new mongoose.Types.ObjectId(),
      };

      // Mock Express request and response objects
      const req = {
          body: updateEmployeeData,
          params: { id: employeeId },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findByIdAndUpdate method to resolve with the sample employee data
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue(updateEmployeeData);

      // Call the controller function
      await editEmployee(req, res);

      // Assertions
      expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(employeeId, updateEmployeeData,{ new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee details updated successfully' });
  });

  test('should_handle_not_found_error_when_updating_a_non_existent_employee', async () => {

      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findByIdAndUpdate method to resolve with null
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      // Call the controller function
      await editEmployee(req, res);

      // Assertions
      expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, {}, { new: true });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee not found' });
  });

  test('updateemployee_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Employee.findByIdAndUpdate
      const error = new Error('Database error');

      // Sample employee data
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findByIdAndUpdate method to reject with an error
      Employee.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      // Call the controller function
      await editEmployee(req, res);

      // Assertions
      expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, {}, { new: true });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });

});

describe('deleteEmployeeController', () => {

  test('deleteemployee_should_delete_employee_and_respond_with_a_200_status_code_and_success_message', async () => {

      const employeeId = new mongoose.Types.ObjectId();

      // Mock Express request and response objects
      const req = {
          params: { id: employeeId },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findByIdAndDelete method to resolve with the sample employee data
      Employee.findByIdAndDelete = jest.fn().mockResolvedValue({
          _id: employeeId,
          firstName: 'JohnDelete',
          lastName: 'Doe',
          mobileNumber: '1234567890',
          mailId: 'delete@gmail.com',
          dateOfBirth:'1998-01-01',
          age:'22',
          gender:'male',
          education:'BE',
          experience:'1',
          userId: new mongoose.Types.ObjectId(),

      });

      // Call the controller function
      await deleteEmployee(req, res);

      // Assertions
      expect(Employee.findByIdAndDelete).toHaveBeenCalledWith(employeeId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee details deleted successfully' });
  });

  test('should_handle_not_found_error_when_deleting_a_non_existent_employee_with_404_status_code', async () => {

      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findByIdAndDelete method to resolve with null
      Employee.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      // Call the controller function
      await deleteEmployee(req, res);

      // Assertions
      expect(Employee.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee not found' });
  });

  test('deleteemployee_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Employee.findByIdAndDelete
      const error = new Error('Database error');

      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findByIdAndDelete method to reject with an error
      Employee.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      // Call the controller function
      await deleteEmployee(req, res);

      // Assertions
      expect(Employee.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bad request' });
  });

});

describe('getEmployeeByIdController', () => {

  test('getemployeebyid_should_return_employee_and_respond_with_a_200_status_code', async () => {
      // Sample employee data
      const employeeId = new mongoose.Types.ObjectId();
      const employeeData = {
          _id: employeeId,
          firstName: 'John',
          lastName: 'Doe',
          mobileNumber: '1234567890',
          mailId: 'find@gmail.com',
          dateOfBirth:'1998-01-01',
          age:'22',
          gender:'male',
          education:'BE',
          experience:'1',
          userId: new mongoose.Types.ObjectId(),
      };

      // Mock Express request and response objects
      Employee.findById = jest.fn().mockResolvedValue(employeeData);
      const req = {
          params: { id: employeeId },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Call the controller function
      await getEmployeeById(req, res);

      // Assertions
      expect(Employee.findById).toHaveBeenCalledWith(employeeId, {__v: 0, _id: 0});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(employeeData);
  });

  test('getemployeebyid_should_handle_not_found_error_and_respond_with_a_404_status_code_and_an_error_message', async () => {
      // Mock Express request and response objects
      const req = {
          params: { id: new mongoose.Types.ObjectId() },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findById method to resolve with null
      Employee.findById = jest.fn().mockResolvedValue(null);

      // Call the controller function
      await getEmployeeById(req, res);

      // Assertions
      expect(Employee.findById).toHaveBeenCalledWith(req.params.id, {__v: 0, _id: 0});
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee not found' });
  });


  test('getemployeebyid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Employee.findById
      const error = new Error('Database error');

      // Mock Express request and response objects
      const req = {
          params: { id: new mongoose.Types.ObjectId() },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.findById method to reject with an error
      Employee.findById = jest.fn().mockRejectedValue(error);

      // Call the controller function
      await getEmployeeById(req, res);

      // Assertions
      expect(Employee.findById).toHaveBeenCalledWith(req.params.id, {__v: 0, _id: 0});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });

});
describe('getEmployeeByUserIdController', () => {
    
  test('getemployeebyuserid_should_return_employee_and_respond_with_a_200_status_code', async () => {
      // Sample employee data
      const userId = new mongoose.Types.ObjectId();
      const employeeData = [
      {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'John',
          lastName: 'Doe',
          mobileNumber: '1234567890',
          mailId: 'sample@gmail.com',
          dateOfBirth:'1998-01-01',
          age:'22',
          gender:'male',
          education:'BE',
          experience:'1',
          userId: new mongoose.Types.ObjectId(),
      },
      {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Anish',
          lastName: 'Joe',
          mobileNumber: '1234567890',
          mailId: 'samp2@gmail.com',
          dateOfBirth:'1998-01-01',
          age:'22',
          gender:'male',
          education:'BE',
          experience:'10',
          userId:userId,
      },
      ];

      // Mock Express request and response objects
      const req = {
          body:{ userId, sortValue: 1, searchValue: 'John' },
      };

      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Mock the Employee.find method to resolve with the sample employee data
      Employee.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(employeeData),
    });

      // Call the controller function
      await getEmployeeByUserId(req, res);

      // Assertions
      // expect(Employee.find).toHaveBeenCalledWith({ userId });
      expect(Employee.find).toHaveBeenCalledWith({ userId, firstName: /John/i });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(employeeData);
  });


  test('getemployeebyuserid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Employee.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
        body:{ userId: new mongoose.Types.ObjectId(), sortValue: 1, searchValue: '' },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Mock the Employee.find method to reject with an error
    Employee.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockRejectedValue(error),
  });

    // Call the controller function
    await getEmployeeByUserId(req, res);

    // Assertions
    // expect(Employee.find).toHaveBeenCalledWith({userId, firstName: new RegExp('', 'i')});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
});


});

