using System;
using System.Linq;
using AutoMapper;
using grad_proj_api.DTOs;
using grad_proj_api.Models;
using Google.Apis.Auth;

namespace grad_proj_api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDTO>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photo.Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth == null ? (int?)null : src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForDetailedDTO>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photo.Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth == null ? (int?)null : src.DateOfBirth.CalculateAge()))
                .ForMember(dest => dest.CreatedUTC,
                    opt => opt.MapFrom(src => src.CreatedUTC.ToLocalTime()))
                .ForMember(dest => dest.LastActiveUTC,
                    opt => opt.MapFrom(src => src.LastActiveUTC.Value.ToLocalTime()))
                .ForMember(dest => dest.Country,
                    opt => opt.MapFrom(src => src.Country == null ? null : src.Country.Name))
                .ForMember(dest => dest.Alpha2Code,
                    opt => opt.MapFrom(src => src.Country == null ? null : src.Country.Alpha2Code));

            CreateMap<GoogleJsonWebSignature.Payload, User>()
                .ForMember(dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.GivenName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.FamilyName))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => GenderEnum.None));

            CreateMap<UserForEditDTO, User>();
            CreateMap<Country, CountryDTO>();
            CreateMap<PhotoForAddingDTO, Photo>();
            CreateMap<Photo, PhotoToReturnDTO>();
            CreateMap<Message, MessageForSendingDTO>()
                .ForMember(dest => dest.MessageSent, opt => opt.MapFrom(src => src.MessageSent.ToLocalTime()))
                .ReverseMap();

            CreateMap<User, UserToReturnDTO>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photo.Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth == null ? (int?)null : src.DateOfBirth.CalculateAge()));
            CreateMap<UserForRegisterDTO, User>();
            CreateMap<Message, MessageToReturnDTO>()
                .ForMember(dest => dest.MessageSent, opt => opt.MapFrom(src => src.MessageSent.ToLocalTime()))
                .ForMember(dest => dest.DateRead, opt => opt.MapFrom(src => src.DateRead != null ? src.DateRead.Value.ToLocalTime() :
                  src.DateRead))
                .ForMember(dest => dest.SenderPhotoUrl,
                    opt => opt.MapFrom(src => src.Sender.Photo.Url));

        }
    }
}