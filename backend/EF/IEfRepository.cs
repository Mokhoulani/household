public interface IEfRepository<T>
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetByIdAsync(int id);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<IQueryable<T>> QueryAsync();
    Task<IEnumerable<T>> FindAsync(Func<T, bool> predicate);
    Task<int> SaveChangesAsync();
}
