﻿using MongoDB.Bson;

namespace OnlineTraining.Entities.Entities
{
    public class CourseMedia : BaseEntity
    {
        public string CourseDetailId { get; set; }
        public string BlobUrl { get; set; }
        public string ThumbnailUrl { get; set; }
    }
}