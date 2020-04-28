using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Dtos;
using grad_proj_api.DTOs;
using grad_proj_api.Models;
using Google.Apis.Auth;

namespace grad_proj_api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photo.Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth == null ? (int?)null : src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserToReturnDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photo.Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth == null ? (int?)null : src.DateOfBirth.CalculateAge()))
                .ForMember(dest => dest.CountryAlpha2Code,
                    opt => opt.MapFrom(src => src.Country == null ? null : src.Country.Alpha2Code))
                .ForMember(dest => dest.CountryName,
                    opt => opt.MapFrom(src => src.Country == null ? null : src.Country.Name))
                .ForMember(dest => dest.CountryNumericCode,
                    opt => opt.MapFrom(src => src.Country == null ? (int?)null : src.Country.NumericCode))
                .ForMember(dest => dest.ProgrammingLanguagesIds,
                    opt => opt.MapFrom(src => src.UserProgrammingLanguages == null ? null : src.UserProgrammingLanguages.Select(pl => pl.ProgrammingLanguageId).ToList()))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth == null ? (int?)null : src.DateOfBirth.CalculateAge()));

            CreateMap<GoogleJsonWebSignature.Payload, User>()
                .ForMember(dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.GivenName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.FamilyName))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => GenderEnum.None));

            CreateMap<Country, CountryDto>();

            CreateMap<ProgrammingLanguage, ProgrammingLanguageDto>();
            CreateMap<PhotoForAddingDto, Photo>();
            CreateMap<Photo, PhotoToReturnDto>();
            CreateMap<Message, MessageForSendingDto>()
                .ForMember(dest => dest.MessageSentUtc, opt => opt.MapFrom(src => src.MessageSentUtc.ToLocalTime()))
                .ReverseMap();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<UserForSignUpDto, User>();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(dest => dest.MessageSentUtc, opt => opt.MapFrom(src => src.MessageSentUtc.ToLocalTime()))
                .ForMember(dest => dest.DateReadUtc, opt => opt.MapFrom(src => src.DateReadUtc != null ? src.DateReadUtc.Value.ToLocalTime() :
                  src.DateReadUtc))
                .ForMember(dest => dest.SenderPhotoUrl,
                    opt => opt.MapFrom(src => src.Sender.Photo.Url));

            CreateMap<PostForAddDto, Post>();
            CreateMap<Post, postToReturnDto>()
                .ForMember(dest => dest.UserPhotoUrl, opt => opt.MapFrom(src => src.User.Photo.Url))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.VotesCount, opt => opt.MapFrom(src => src.PostUpVoters.Count() - src.PostDownVoters.Count()))
                .ForMember(dest => dest.ViewersCount, opt => opt.MapFrom(src => src.PostViewers.Count()));

            CreateMap<PostForEditDto, Post>();

            CreateMap<CommentForAddDto, Comment>();

            CreateMap<CommentForEditDto, Comment>();

            CreateMap<Comment, CommentToReturnDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.UsernamePhotoUrl, opt => opt.MapFrom(src => src.User.Photo.Url))
                .ForMember(dest => dest.VotesCount, opt => opt.MapFrom(src => src.CommentUpVoters.Count() - src.CommentDownVoters.Count()));
        }
    }
}