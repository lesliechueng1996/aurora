import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';

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
});
