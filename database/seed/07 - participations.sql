USE Basketball;
GO

INSERT INTO Participation (Id, SelectionId, GameId, Quarter)
VALUES
-- Atlanta Hawks (ATL) vs. Boston Celtics (BOS)
(1, 1, 1, 1), (2, 2, 1, 1), (3, 3, 1, 1), (4, 4, 1, 1), (5, 5, 1, 1), (6, 6, 1, 1), (7, 7, 1, 1), (8, 8, 1, 1), (9, 9, 1, 1), (10, 10, 1, 1),
(11, 11, 1, 2), (12, 12, 1, 2), (13, 13, 1, 2), (14, 14, 1, 2), (15, 15, 1, 2), (16, 16, 1, 2), (17, 17, 1, 2), (18, 18, 1, 2), (19, 19, 1, 2), (20, 20, 1, 2),
-- Brooklyn Nets (BKN) vs. Charlotte Hornets (CHA)
(21, 21, 2, 1), (22, 22, 2, 1), (23, 23, 2, 1), (24, 24, 2, 1), (25, 25, 2, 1), (26, 26, 2, 1), (27, 27, 2, 1), (28, 28, 2, 1), (29, 29, 2, 1), (30, 30, 2, 1),
(31, 31, 2, 2), (32, 32, 2, 2), (33, 33, 2, 2), (34, 34, 2, 2), (35, 35, 2, 2), (36, 36, 2, 2), (37, 37, 2, 2), (38, 38, 2, 2), (39, 39, 2, 2), (40, 40, 2, 2),
-- Chicago Bulls (CHI) vs. Cleveland Cavaliers (CLE)
(41, 41, 3, 1), (42, 42, 3, 1), (43, 43, 3, 1), (44, 44, 3, 1), (45, 45, 3, 1), (46, 46, 3, 1), (47, 47, 3, 1), (48, 48, 3, 1), (49, 49, 3, 1), (50, 50, 3, 1),
(51, 51, 3, 2), (52, 52, 3, 2), (53, 53, 3, 2), (54, 54, 3, 2), (55, 55, 3, 2), (56, 56, 3, 2), (57, 57, 3, 2), (58, 58, 3, 2), (59, 59, 3, 2), (60, 60, 3, 2),
-- Dallas Mavericks (DAL) vs. Denver Nuggets (DEN)
(61, 61, 4, 1), (62, 62, 4, 1), (63, 63, 4, 1), (64, 64, 4, 1), (65, 65, 4, 1), (66, 66, 4, 1), (67, 67, 4, 1), (68, 68, 4, 1), (69, 69, 4, 1), (70, 70, 4, 1),
(71, 71, 4, 2), (72, 72, 4, 2), (73, 73, 4, 2), (74, 74, 4, 2), (75, 75, 4, 2), (76, 76, 4, 2), (77, 77, 4, 2), (78, 78, 4, 2), (79, 79, 4, 2), (80, 80, 4, 2),
-- Detroit Pistons (DET) vs. Golden State Warriors (GSW)
(81, 81, 5, 1), (82, 82, 5, 1), (83, 83, 5, 1), (84, 84, 5, 1), (85, 85, 5, 1), (86, 86, 5, 1), (87, 87, 5, 1), (88, 88, 5, 1), (89, 89, 5, 1), (90, 90, 5, 1),
(91, 91, 5, 2), (92, 92, 5, 2), (93, 93, 5, 2), (94, 94, 5, 2), (95, 95, 5, 2), (96, 96, 5, 2), (97, 97, 5, 2), (98, 98, 5, 2), (99, 99, 5, 2), (100, 100, 5, 2),
-- Houston Rockets (HOU) vs. Indiana Pacers (IND)
(101, 101, 6, 1), (102, 102, 6, 1), (103, 103, 6, 1), (104, 104, 6, 1), (105, 105, 6, 1), (106, 106, 6, 1), (107, 107, 6, 1), (108, 108, 6, 1), (109, 109, 6, 1), (110, 110, 6, 1),
(111, 111, 6, 2), (112, 112, 6, 2), (113, 113, 6, 2), (114, 114, 6, 2), (115, 115, 6, 2), (116, 116, 6, 2), (117, 117, 6, 2), (118, 118, 6, 2), (119, 119, 6, 2), (120, 120, 6, 2),
-- Los Angeles Clippers (LAC) vs. Los Angeles Lakers (LAL)
(121, 121, 7, 1), (122, 122, 7, 1), (123, 123, 7, 1), (124, 124, 7, 1), (125, 125, 7, 1), (126, 126, 7, 1), (127, 127, 7, 1), (128, 128, 7, 1), (129, 129, 7, 1), (130, 130, 7, 1),
(131, 131, 7, 2), (132, 132, 7, 2), (133, 133, 7, 2), (134, 134, 7, 2), (135, 135, 7, 2), (136, 136, 7, 2), (137, 137, 7, 2), (138, 138, 7, 2), (139, 139, 7, 2), (140, 140, 7, 2),
-- Memphis Grizzlies (MEM) vs. Miami Heat (MIA)
(141, 141, 8, 1), (142, 142, 8, 1), (143, 143, 8, 1), (144, 144, 8, 1), (145, 145, 8, 1), (146, 146, 8, 1), (147, 147, 8, 1), (148, 148, 8, 1), (149, 149, 8, 1), (150, 150, 8, 1),
(151, 151, 8, 2), (152, 152, 8, 2), (153, 153, 8, 2), (154, 154, 8, 2), (155, 155, 8, 2), (156, 156, 8, 2), (157, 157, 8, 2), (158, 158, 8, 2), (159, 159, 8, 2), (160, 160, 8, 2),
-- Milwaukee Bucks (MIL) vs. Minnesota Timberwolves (MIN)
(161, 161, 9, 1), (162, 162, 9, 1), (163, 163, 9, 1), (164, 164, 9, 1), (165, 165, 9, 1), (166, 166, 9, 1), (167, 167, 9, 1), (168, 168, 9, 1), (169, 169, 9, 1), (170, 170, 9, 1),
(171, 171, 9, 2), (172, 172, 9, 2), (173, 173, 9, 2), (174, 174, 9, 2), (175, 175, 9, 2), (176, 176, 9, 2), (177, 177, 9, 2), (178, 178, 9, 2), (179, 179, 9, 2), (180, 180, 9, 2),
-- New Orleans Pelicans (NOP) vs. New York Knicks (NYK)
(181, 181, 10, 1), (182, 182, 10, 1), (183, 183, 10, 1), (184, 184, 10, 1), (185, 185, 10, 1), (186, 186, 10, 1), (187, 187, 10, 1), (188, 188, 10, 1), (189, 189, 10, 1), (190, 190, 10, 1),
(191, 191, 10, 2), (192, 192, 10, 2), (193, 193, 10, 2), (194, 194, 10, 2), (195, 195, 10, 2), (196, 196, 10, 2), (197, 197, 10, 2), (198, 198, 10, 2), (199, 199, 10, 2), (200, 200, 10, 2),
-- Oklahoma City Thunder (OKC) vs. Orlando Magic (ORL)
(201, 201, 11, 1), (202, 202, 11, 1), (203, 203, 11, 1), (204, 204, 11, 1), (205, 205, 11, 1), (206, 206, 11, 1), (207, 207, 11, 1), (208, 208, 11, 1), (209, 209, 11, 1), (210, 210, 11, 1),
(211, 211, 11, 2), (212, 212, 11, 2), (213, 213, 11, 2), (214, 214, 11, 2), (215, 215, 11, 2), (216, 216, 11, 2), (217, 217, 11, 2), (218, 218, 11, 2), (219, 219, 11, 2), (220, 220, 11, 2),
-- Philadelphia 76ers (PHI) vs. Phoenix Suns (PHX)
(221, 221, 12, 1), (222, 222, 12, 1), (223, 223, 12, 1), (224, 224, 12, 1), (225, 225, 12, 1), (226, 226, 12, 1), (227, 227, 12, 1), (228, 228, 12, 1), (229, 229, 12, 1), (230, 230, 12, 1),
(231, 231, 12, 2), (232, 232, 12, 2), (233, 233, 12, 2), (234, 234, 12, 2), (235, 235, 12, 2), (236, 236, 12, 2), (237, 237, 12, 2), (238, 238, 12, 2), (239, 239, 12, 2), (240, 240, 12, 2),
-- Portland Trail Blazers (POR) vs. Sacramento Kings (SAC)
(241, 241, 13, 1), (242, 242, 13, 1), (243, 243, 13, 1), (244, 244, 13, 1), (245, 245, 13, 1), (246, 246, 13, 1), (247, 247, 13, 1), (248, 248, 13, 1), (249, 249, 13, 1), (250, 250, 13, 1),
(251, 251, 13, 2), (252, 252, 13, 2), (253, 253, 13, 2), (254, 254, 13, 2), (255, 255, 13, 2), (256, 256, 13, 2), (257, 257, 13, 2), (258, 258, 13, 2), (259, 259, 13, 2), (260, 260, 13, 2),
-- San Antonio Spurs (SAS) vs. Toronto Raptors (TOR)
(261, 261, 14, 1), (262, 262, 14, 1), (263, 263, 14, 1), (264, 264, 14, 1), (265, 265, 14, 1), (266, 266, 14, 1), (267, 267, 14, 1), (268, 268, 14, 1), (269, 269, 14, 1), (270, 270, 14, 1),
(271, 271, 14, 2), (272, 272, 14, 2), (273, 273, 14, 2), (274, 274, 14, 2), (275, 275, 14, 2), (276, 276, 14, 2), (277, 277, 14, 2), (278, 278, 14, 2), (279, 279, 14, 2), (280, 280, 14, 2),
-- Utah Jazz (UTA) vs. Washington Wizards (WAS)
(281, 281, 15, 1), (282, 282, 15, 1), (283, 283, 15, 1), (284, 284, 15, 1), (285, 285, 15, 1), (286, 286, 15, 1), (287, 287, 15, 1), (288, 288, 15, 1), (289, 289, 15, 1), (290, 290, 15, 1),
(291, 291, 15, 2), (292, 292, 15, 2), (293, 293, 15, 2), (294, 294, 15, 2), (295, 295, 15, 2), (296, 296, 15, 2), (297, 297, 15, 2), (298, 298, 15, 2), (299, 299, 15, 2), (300, 300, 15, 2);

INSERT INTO Participation (Id, SelectionId, GameId, Quarter)
VALUES

-- Atlanta Hawks (ATL) vs. Boston Celtics (BOS)
(301, 301, 16, 1), (302, 302, 16, 1), (303, 303, 16, 1), (304, 304, 16, 1), (305, 305, 16, 1), (306, 306, 16, 1), (307, 307, 16, 1), (308, 308, 16, 1), (309, 309, 16, 1), (310, 310, 16, 1),
(311, 311, 16, 2), (312, 312, 16, 2), (313, 313, 16, 2), (314, 314, 16, 2), (315, 315, 16, 2), (316, 316, 16, 2), (317, 317, 16, 2), (318, 318, 16, 2), (319, 319, 16, 2), (320, 320, 16, 2),
-- Brooklyn Nets (BKN) vs. Charlotte Hornets (CHA)
(321, 321, 17, 1), (322, 322, 17, 1), (323, 323, 17, 1), (324, 324, 17, 1), (325, 325, 17, 1), (326, 326, 17, 1), (327, 327, 17, 1), (328, 328, 17, 1), (329, 329, 17, 1), (330, 330, 17, 1),
(331, 331, 17, 2), (332, 332, 17, 2), (333, 333, 17, 2), (334, 334, 17, 2), (335, 335, 17, 2), (336, 336, 17, 2), (337, 337, 17, 2), (338, 338, 17, 2), (339, 339, 17, 2), (340, 340, 17, 2),
-- Chicago Bulls (CHI) vs. Cleveland Cavaliers (CLE)
(341, 341, 18, 1), (342, 342, 18, 1), (343, 343, 18, 1), (344, 344, 18, 1), (345, 345, 18, 1), (346, 346, 18, 1), (347, 347, 18, 1), (348, 348, 18, 1), (349, 349, 18, 1), (350, 350, 18, 1),
(351, 351, 18, 2), (352, 352, 18, 2), (353, 353, 18, 2), (354, 354, 18, 2), (355, 355, 18, 2), (356, 356, 18, 2), (357, 357, 18, 2), (358, 358, 18, 2), (359, 359, 18, 2), (360, 360, 18, 2),
-- Dallas Mavericks (DAL) vs. Denver Nuggets (DEN)
(361, 361, 19, 1), (362, 362, 19, 1), (363, 363, 19, 1), (364, 364, 19, 1), (365, 365, 19, 1), (366, 366, 19, 1), (367, 367, 19, 1), (368, 368, 19, 1), (369, 369, 19, 1), (370, 370, 19, 1),
(371, 371, 19, 2), (372, 372, 19, 2), (373, 373, 19, 2), (374, 374, 19, 2), (375, 375, 19, 2), (376, 376, 19, 2), (377, 377, 19, 2), (378, 378, 19, 2), (379, 379, 19, 2), (380, 380, 19, 2),
-- Detroit Pistons (DET) vs. Golden State Warriors (GSW)
(381, 381, 20, 1), (382, 382, 20, 1), (383, 383, 20, 1), (384, 384, 20, 1), (385, 385, 20, 1), (386, 386, 20, 1), (387, 387, 20, 1), (388, 388, 20, 1), (389, 389, 20, 1), (390, 390, 20, 1),
(391, 391, 20, 2), (392, 392, 20, 2), (393, 393, 20, 2), (394, 394, 20, 2), (395, 395, 20, 2), (396, 396, 20, 2), (397, 397, 20, 2), (398, 398, 20, 2), (399, 399, 20, 2), (400, 400, 20, 2),
-- Houston Rockets (HOU) vs. Indiana Pacers (IND)
(401, 401, 21, 1), (402, 402, 21, 1), (403, 403, 21, 1), (404, 404, 21, 1), (405, 405, 21, 1), (406, 406, 21, 1), (407, 407, 21, 1), (408, 408, 21, 1), (409, 409, 21, 1), (410, 410, 21, 1),
(411, 411, 21, 2), (412, 412, 21, 2), (413, 413, 21, 2), (414, 414, 21, 2), (415, 415, 21, 2), (416, 416, 21, 2), (417, 417, 21, 2), (418, 418, 21, 2), (419, 419, 21, 2), (420, 420, 21, 2),
-- Los Angeles Clippers (LAC) vs. Los Angeles Lakers (LAL)
(421, 421, 22, 1), (422, 422, 22, 1), (423, 423, 22, 1), (424, 424, 22, 1), (425, 425, 22, 1), (426, 426, 22, 1), (427, 427, 22, 1), (428, 428, 22, 1), (429, 429, 22, 1), (430, 430, 22, 1),
(431, 431, 22, 2), (432, 432, 22, 2), (433, 433, 22, 2), (434, 434, 22, 2), (435, 435, 22, 2), (436, 436, 22, 2), (437, 437, 22, 2), (438, 438, 22, 2), (439, 439, 22, 2), (440, 440, 22, 2),
-- Memphis Grizzlies (MEM) vs. Miami Heat (MIA)
(441, 441, 23, 1), (442, 442, 23, 1), (443, 443, 23, 1), (444, 444, 23, 1), (445, 445, 23, 1), (446, 446, 23, 1), (447, 447, 23, 1), (448, 448, 23, 1), (449, 449, 23, 1), (450, 450, 23, 1),
(451, 451, 23, 2), (452, 452, 23, 2), (453, 453, 23, 2), (454, 454, 23, 2), (455, 455, 23, 2), (456, 456, 23, 2), (457, 457, 23, 2), (458, 458, 23, 2), (459, 459, 23, 2), (460, 460, 23, 2),
-- Milwaukee Bucks (MIL) vs. Minnesota Timberwolves (MIN)
(461, 461, 24, 1), (462, 462, 24, 1), (463, 463, 24, 1), (464, 464, 24, 1), (465, 465, 24, 1), (466, 466, 24, 1), (467, 467, 24, 1), (468, 468, 24, 1), (469, 469, 24, 1), (470, 470, 24, 1),
(471, 471, 24, 2), (472, 472, 24, 2), (473, 473, 24, 2), (474, 474, 24, 2), (475, 475, 24, 2), (476, 476, 24, 2), (477, 477, 24, 2), (478, 478, 24, 2), (479, 479, 24, 2), (480, 480, 24, 2),
-- New Orleans Pelicans (NOP) vs. New York Knicks (NYK)
(481, 481, 25, 1), (482, 482, 25, 1), (483, 483, 25, 1), (484, 484, 25, 1), (485, 485, 25, 1), (486, 486, 25, 1), (487, 487, 25, 1), (488, 488, 25, 1), (489, 489, 25, 1), (490, 490, 25, 1),
(491, 491, 25, 2), (492, 492, 25, 2), (493, 493, 25, 2), (494, 494, 25, 2), (495, 495, 25, 2), (496, 496, 25, 2), (497, 497, 25, 2), (498, 498, 25, 2), (499, 499, 25, 2), (500, 500, 25, 2),
-- Oklahoma City Thunder (OKC) vs. Orlando Magic (ORL)
(501, 501, 26, 1), (502, 502, 26, 1), (503, 503, 26, 1), (504, 504, 26, 1), (505, 505, 26, 1), (506, 506, 26, 1), (507, 507, 26, 1), (508, 508, 26, 1), (509, 509, 26, 1), (510, 510, 26, 1),
(511, 511, 26, 2), (512, 512, 26, 2), (513, 513, 26, 2), (514, 514, 26, 2), (515, 515, 26, 2), (516, 516, 26, 2), (517, 517, 26, 2), (518, 518, 26, 2), (519, 519, 26, 2), (520, 520, 26, 2),
-- Philadelphia 76ers (PHI) vs. Phoenix Suns (PHX)
(521, 521, 27, 1), (522, 522, 27, 1), (523, 523, 27, 1), (524, 524, 27, 1), (525, 525, 27, 1), (526, 526, 27, 1), (527, 527, 27, 1), (528, 528, 27, 1), (529, 529, 27, 1), (530, 530, 27, 1),
(531, 531, 27, 2), (532, 532, 27, 2), (533, 533, 27, 2), (534, 534, 27, 2), (535, 535, 27, 2), (536, 536, 27, 2), (537, 537, 27, 2), (538, 538, 27, 2), (539, 539, 27, 2), (540, 540, 27, 2),
-- Portland Trail Blazers (POR) vs. Sacramento Kings (SAC)
(541, 541, 28, 1), (542, 542, 28, 1), (543, 543, 28, 1), (544, 544, 28, 1), (545, 545, 28, 1), (546, 546, 28, 1), (547, 547, 28, 1), (548, 548, 28, 1), (549, 549, 28, 1), (550, 550, 28, 1),
(551, 551, 28, 2), (552, 552, 28, 2), (553, 553, 28, 2), (554, 554, 28, 2), (555, 555, 28, 2), (556, 556, 28, 2), (557, 557, 28, 2), (558, 558, 28, 2), (559, 559, 28, 2), (560, 560, 28, 2),
-- San Antonio Spurs (SAS) vs. Toronto Raptors (TOR)
(561, 561, 29, 1), (562, 562, 29, 1), (563, 563, 29, 1), (564, 564, 29, 1), (565, 565, 29, 1), (566, 566, 29, 1), (567, 567, 29, 1), (568, 568, 29, 1), (569, 569, 29, 1), (570, 570, 29, 1),
(571, 571, 29, 2), (572, 572, 29, 2), (573, 573, 29, 2), (574, 574, 29, 2), (575, 575, 29, 2), (576, 576, 29, 2), (577, 577, 29, 2), (578, 578, 29, 2), (579, 579, 29, 2), (580, 580, 29, 2),
-- Utah Jazz (UTA) vs. Washington Wizards (WAS)
(581, 581, 30, 1), (582, 582, 30, 1), (583, 583, 30, 1), (584, 584, 30, 1), (585, 585, 30, 1), (586, 586, 30, 1), (587, 587, 30, 1), (588, 588, 30, 1), (589, 589, 30, 1), (590, 590, 30, 1),
(591, 591, 30, 2), (592, 592, 30, 2), (593, 593, 30, 2), (594, 594, 30, 2), (595, 595, 30, 2), (596, 596, 30, 2), (597, 597, 30, 2), (598, 598, 30, 2), (599, 599, 30, 2), (600, 600, 30, 2);




