import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            createCatrgory: jest.fn(),
            searchCategories: jest.fn(),
            deleteById: jest.fn(),
            deleteBatch: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('create category success', async () => {
    const categoryName = 'test';

    await controller.createCategory({ categoryName });

    expect(categoryService.createCatrgory).toHaveBeenCalledTimes(1);
    expect(categoryService.createCatrgory).lastCalledWith(categoryName);
  });

  it('search categories success', async () => {
    const query = { page: 1, limit: 10, searchCategoryName: 'test' };

    await controller.findCategories(query);

    expect(categoryService.searchCategories).toHaveBeenCalledTimes(1);
    expect(categoryService.searchCategories).lastCalledWith(query);
  });

  it('delete one category success', async () => {
    const id = 1;

    await controller.deleteOneCategory(id);

    expect(categoryService.deleteById).toHaveBeenCalledTimes(1);
    expect(categoryService.deleteById).lastCalledWith(id);
  });

  it('delete batch success', async () => {
    const ids = [1];

    await controller.deleteBatchCategories(ids);

    expect(categoryService.deleteBatch).toHaveBeenCalledTimes(1);
    expect(categoryService.deleteBatch).lastCalledWith(ids);
  });

  it('get category not found', async () => {
    const id = 1;
    const findByIdFn = jest.spyOn(categoryService, 'findById');
    findByIdFn.mockResolvedValueOnce(null);

    await expect(controller.getCategory(id)).rejects.toThrowError(
      NotFoundException,
    );

    expect(findByIdFn).toHaveBeenCalledTimes(1);
    expect(findByIdFn).lastCalledWith(id);
  });

  it('get category success', async () => {
    const id = 1;
    const findByIdFn = jest.spyOn(categoryService, 'findById');
    findByIdFn.mockResolvedValueOnce({
      id,
      categoryName: 'test',
      createTime: new Date(),
      updateTime: new Date(),
    });

    await controller.getCategory(id);

    expect(categoryService.findById).toHaveBeenCalledTimes(1);
    expect(categoryService.findById).lastCalledWith(id);
  });

  it('update category success', async () => {
    const id = 1;
    const body = {
      categoryName: 'test',
    };

    await controller.updateCategory(id, body);

    expect(categoryService.updateById).toHaveBeenCalledTimes(1);
    expect(categoryService.updateById).lastCalledWith(id, body.categoryName);
  });
});
