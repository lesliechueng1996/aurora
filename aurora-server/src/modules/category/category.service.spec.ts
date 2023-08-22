import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            countBy: jest.fn(),
            insert: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    mockRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  it('dupelicate category name should throw error', async () => {
    const categoryName = 'test';

    const spyFn = jest.spyOn(mockRepository, 'countBy');
    spyFn.mockResolvedValueOnce(1);

    await expect(service.createCatrgory(categoryName)).rejects.toThrow(
      ConflictException,
    );
    expect(spyFn).toHaveBeenCalledTimes(1);
    expect(spyFn).lastCalledWith({ categoryName });
  });

  it('create category success', async () => {
    const categoryName = 'test';

    const countBy = jest.spyOn(mockRepository, 'countBy');
    countBy.mockResolvedValueOnce(0);

    const insert = jest.spyOn(mockRepository, 'insert');

    await service.createCatrgory(categoryName);

    expect(countBy).toHaveBeenCalledTimes(1);
    expect(countBy).lastCalledWith({ categoryName });
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).lastCalledWith({ categoryName });
  });

  it('search categories no data', async () => {
    const mockObj = {
      searchCategoryName: 'test',
      page: 1,
      limit: 10,
    };

    const findAndCount = jest.spyOn(mockRepository, 'findAndCount');
    findAndCount.mockResolvedValueOnce([[], 0]);

    const result = await service.searchCategories(mockObj);

    expect(findAndCount).toHaveBeenCalledTimes(1);
    expect(findAndCount).lastCalledWith({
      where: {
        categoryName: Like(`%${mockObj.searchCategoryName}%`),
      },
      take: mockObj.limit,
      skip: (mockObj.page - 1) * mockObj.limit,
    });
    expect(result).toEqual({ modifiedList: [], total: 0 });
  });

  it('search categories success', async () => {
    const mockObj = {
      searchCategoryName: 'test',
      page: 1,
      limit: 10,
    };
    const createTime = new Date('2023-08-22 00:00:00');

    const findAndCount = jest.spyOn(mockRepository, 'findAndCount');
    findAndCount.mockResolvedValueOnce([
      [
        {
          id: 1,
          categoryName: 'test',
          createTime: createTime,
          updateTime: new Date(),
        },
      ],
      5,
    ]);

    const result = await service.searchCategories(mockObj);

    expect(result).toEqual({
      modifiedList: [
        {
          id: 1,
          categoryName: 'test',
          articleCount: 0,
          createTime: '2023-08-22',
        },
      ],
      total: 5,
    });
  });

  it('delete by id success', async () => {
    const id = 1;
    const deleteFn = jest.spyOn(mockRepository, 'delete');

    await service.deleteById(id);

    expect(deleteFn).toHaveBeenCalledTimes(1);
    expect(deleteFn).lastCalledWith(id);
  });

  it('delete batch success', async () => {
    const ids = [1, 2, 3];
    const deleteFn = jest.spyOn(mockRepository, 'delete');

    await service.deleteBatch(ids);

    expect(deleteFn).toHaveBeenCalledTimes(1);
    expect(deleteFn).lastCalledWith(ids);
  });

  it('find category success', async () => {
    const id = 1;
    const findOneByFn = jest.spyOn(mockRepository, 'findOneBy');

    await service.findById(id);

    expect(findOneByFn).toHaveBeenCalledTimes(1);
    expect(findOneByFn).lastCalledWith({ id });
  });

  it('update category no data', async () => {
    const id = 1;
    const findOneByFn = jest.spyOn(mockRepository, 'findOneBy');
    findOneByFn.mockResolvedValueOnce(null);

    await expect(service.updateById(id, 'test')).rejects.toThrow(
      NotFoundException,
    );
    expect(findOneByFn).toHaveBeenCalledTimes(1);
  });

  it('update category dupelicate name', async () => {
    const id = 1;

    const findOneByFn = jest.spyOn(mockRepository, 'findOneBy');
    findOneByFn.mockResolvedValueOnce({
      id: 1,
      categoryName: 'test',
      createTime: new Date(),
      updateTime: new Date(),
    });

    const spyFn = jest.spyOn(mockRepository, 'countBy');
    spyFn.mockResolvedValueOnce(1);

    await expect(service.updateById(id, 'test')).rejects.toThrow(
      ConflictException,
    );
    expect(spyFn).toHaveBeenCalledTimes(1);
  });

  it('update category success', async () => {
    const id = 1;

    const findOneByFn = jest.spyOn(mockRepository, 'findOneBy');
    findOneByFn.mockResolvedValueOnce({
      id: 1,
      categoryName: 'test',
      createTime: new Date(),
      updateTime: new Date(),
    });

    const spyFn = jest.spyOn(mockRepository, 'countBy');
    spyFn.mockResolvedValueOnce(0);

    const updateFn = jest.spyOn(mockRepository, 'update');

    await service.updateById(id, 'test');

    expect(updateFn).toHaveBeenCalledTimes(1);
    expect(updateFn).lastCalledWith(id, { categoryName: 'test' });
  });
});
