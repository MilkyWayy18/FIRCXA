import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateDto } from './dto';
import { Response } from 'express';
import { User } from '@src/modules/user/entity/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signupLocal: jest.fn(),
            getUserById: jest.fn(),
            GetAll: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('signUp', () => {
    it('should call userService.signupLocal with correct parameters', async () => {
      const createDto: CreateDto = {
          email: 'test@example.com', 
          password: 'password',
          id: 0,
          first_name: ''
      };
      const res: Response = {} as Response;
      await userController.signUp(createDto, res);
      expect(userService.signupLocal).toHaveBeenCalledWith(createDto, res);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedUser: User = { id: 1, email: 'test@example.com' }  as User;
      jest.spyOn(userService, 'getUserById').mockResolvedValue(expectedUser);

      const result = await userController.getUser(userId);
      expect(result).toEqual(expectedUser);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('GetAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers: User[] = [{ id: 1, email: 'test@example.com'}] as User[];
      jest.spyOn(userService, 'GetAll').mockResolvedValue(expectedUsers);

      const result = await userController.GetAll();
      expect(result).toEqual(expectedUsers);
      expect(userService.GetAll).toHaveBeenCalled();
    });
  });

  describe('DeleteUser', () => {
    it('should call userService.deleteUser with correct id', async () => {
      const userId = 1;
      await userController.DeleteUser(userId);
      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });
});