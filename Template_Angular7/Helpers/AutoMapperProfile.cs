using AutoMapper;
using Template_Angular7.Dtos;
using Template_Angular7.Entities;

namespace Template_Angular7.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}