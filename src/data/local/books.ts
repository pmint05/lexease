import { Book } from "@/src/core/types";
import {
  estimateWordTimestamps,
  tokenizeText,
} from "@/src/utils/textProcessing";

const createBook = (
  id: string,
  title: string,
  author: string,
  category: string,
  difficulty: Book["difficulty"],
  coverUrl: string,
  content: string,
): Book => {
  const words = tokenizeText(content);

  return {
    id,
    title,
    author,
    category,
    difficulty,
    coverUrl,
    content,
    words,
    wordCount: words.length,
    estimatedMinutes: Math.max(1, Math.round(words.length / 90)),
    wordTimestamps: estimateWordTimestamps(words, 1.5),
    status: "PUBLISHED",
  };
};

export const sampleBooks: Book[] = [
  createBook(
    "story-01",
    "Rùa và Thỏ",
    "Truyện ngụ ngôn Aesop",
    "Ngụ ngôn",
    "easy",
    "https://picsum.photos/200/300",
    "Một ngày nọ, Thỏ chế nhạo Rùa vì bước đi chậm chạp. Rùa điềm tĩnh đáp: 'Tuy tôi chậm, nhưng tôi sẽ thắng nếu chúng ta thi chạy.' Thỏ cười phá lên và đồng ý ngay. Trận đua bắt đầu, Thỏ thoắt cái đã biến mất. Thấy mình bỏ xa Rùa, Thỏ tự nhủ: 'Mình cứ ngủ một giấc đã, Rùa còn lâu mới tới.' Trong khi Thỏ ngủ say, Rùa vẫn miệt mài bước từng bước rùa bò nhưng không hề dừng lại. Khi Thỏ thức giấc, cậu hốt hoảng nhận ra Rùa đã sắp đến đích. Thỏ vắt chân lên cổ chạy nhưng không kịp nữa. Rùa đã chiến thắng bằng sự kiên trì và bền bỉ của mình.",
  ),
  createBook(
    "story-02",
    "Cậu bé chăn cừu",
    "Truyện ngụ ngôn Aesop",
    "Ngụ ngôn",
    "medium",
    "https://picsum.photos/200/300",
    "Ngày xưa, có một cậu bé chăn cừu trên sườn đồi. Vì buồn chán, cậu nảy ra ý định trêu chọc dân làng. Cậu la lớn: 'Sói! Sói! Có sói ăn thịt cừu!' Dân làng nghe thấy vội vã vác gậy gộc chạy lên, nhưng chẳng thấy con sói nào. Cậu bé cười đắc ý. Vài ngày sau, cậu lại lừa mọi người một lần nữa. Một chiều nọ, một con sói thật xuất hiện. Cậu bé hoảng sợ hét lớn: 'Sói! Sói cứu cháu với!' Nhưng lần này, dân làng nghĩ cậu lại nói dối nên không ai lên giúp. Cuối cùng, bầy cừu của cậu bé đã bị sói ăn thịt hết. Câu chuyện khuyên chúng ta không nên nói dối, vì người hay nói dối sẽ không được ai tin ngay cả khi họ nói thật.",
  ),
  createBook(
    "story-03",
    "Quạ và cái bình nước",
    "Truyện ngụ ngôn Aesop",
    "Ngụ ngôn",
    "easy",
    "https://picsum.photos/200/300",
    "Một con quạ đang rất khát nước. Nó bay lượn mãi tìm nước uống thì thấy một cái bình có một ít nước bên trong. Nhưng cổ bình cao quá, mỏ quạ không thể thò vào tới nơi. Quạ cố gắng đẩy đổ bình nhưng bình quá nặng. Cuối cùng, quạ nảy ra một ý thông minh. Nó nhặt từng hòn sỏi nhỏ thả vào bình. Dần dần, những hòn sỏi làm nước dâng lên cao. Quạ tha hồ uống nước cho thỏa cơn khát rồi vui vẻ cất cánh bay đi. Câu chuyện dạy chúng ta rằng, khi gặp khó khăn, hãy bình tĩnh suy nghĩ để tìm ra cách giải quyết.",
  ),
  createBook(
    "story-04",
    "Hai con dê qua cầu",
    "Truyện dân gian",
    "Dân gian",
    "easy",
    "https://picsum.photos/200/300",
    "Có hai con dê cùng muốn đi qua một chiếc cầu hẹp vắt ngang một con suối nhỏ. Dê Đen đi từ bờ bên này, Dê Trắng đi từ bờ bên kia. Cả hai cùng bước lên cầu và gặp nhau ở giữa. Chiếc cầu quá hẹp không thể đi song song. Dê Đen nói: 'Cậu lùi lại nhường đường cho tôi đi trước!' Dê Trắng không chịu: 'Cậu lùi lại mới đúng, tôi vội hơn!' Không ai chịu nhường ai, hai con dê bắt đầu húc nhau. Cuối cùng, cả hai đều trượt chân rơi tóm xuống dòng suối lạnh buốt. Nếu biết nhường nhịn nhau, cả hai đã có thể qua cầu an toàn.",
  ),
  createBook(
    "story-05",
    "Sự tích hoa cúc trắng",
    "Truyện cổ tích",
    "Cổ tích",
    "hard",
    "https://picsum.photos/200/300",
    "Ngày xưa có hai mẹ con sống trong một túp lều nhỏ. Người mẹ không may lâm bệnh nặng. Cô bé thương mẹ, đi tìm thầy thuốc khắp nơi. Một ông cụ râu tóc bạc phơ xuất hiện và bảo cô bé đi tìm một bông hoa trắng trên núi cao, hoa có bao nhiêu cánh thì mẹ cô sẽ sống thêm bấy nhiêu ngày. Cô bé vượt qua bao gian nan mới tìm được bông hoa, nhưng nó chỉ có vỏn vẹn bốn cánh. Không muốn mẹ rời xa mình, cô bé liền cẩn thận xé nhỏ từng cánh hoa ra thành vô số những cánh hoa li ti. Nhờ đó, người mẹ khỏi bệnh và sống rất thọ. Bông hoa đó sau này được gọi là hoa cúc trắng, biểu tượng của lòng hiếu thảo.",
  ),
  createBook(
    "story-06",
    "Kiến và Châu Chấu",
    "Truyện ngụ ngôn Aesop",
    "Ngụ ngôn",
    "medium",
    "https://picsum.photos/200/300",
    "Vào mùa hè rực rỡ, Châu Chấu suốt ngày chỉ biết ca hát và nhảy múa. Trong khi đó, bầy Kiến lại chăm chỉ tha hạt gạo, hạt ngô về tổ để dự trữ. Châu Chấu cười nhạo Kiến: 'Sao các bạn phải làm việc vất vả thế? Mùa hè còn dài mà!'. Kiến đáp: 'Chúng tôi đang chuẩn bị thức ăn cho mùa đông lạnh giá'. Mùa đông đến, tuyết rơi trắng xóa, không còn cỏ cây hay thức ăn nào cả. Châu Chấu đói lả, đành phải gõ cửa nhà Kiến xin ăn. Kiến tốt bụng chia sẻ thức ăn cho Châu Chấu. Từ đó, Châu Chấu hiểu ra bài học về sự chăm chỉ và biết lo xa.",
  ),
  createBook(
    "story-07",
    "Chú ếch xanh dũng cảm",
    "LexEase Studio",
    "Hiện đại",
    "easy",
    "https://picsum.photos/200/300",
    "Bơi lội dưới ao hồ rất vui, nhưng chú ếch xanh Tí Hon luôn mơ ước được nhảy lên bờ để khám phá thế giới xung quanh. Các bạn ếch khác đều can ngăn vì trên bờ có nhiều nguy hiểm. Tuy nhiên, Tí Hon không bỏ cuộc. Chú hàng ngày tập nhảy cao hơn. Một ngày nọ, trời mưa to khiến nước ao dâng cao, một nhành cây nhỏ gãy rơi xuống nước. Tí Hon đã dũng cảm lấy đà, nhảy lên nhành cây và cứu được một bạn chuồn chuồn bị ướt sũng cánh. Sự dũng cảm của Tí Hon đã truyền cảm hứng cho tất cả mọi người trong ao.",
  ),
  createBook(
    "story-08",
    "Chiếc ô phép màu của bé An",
    "LexEase Studio",
    "Hiện đại",
    "medium",
    "https://picsum.photos/200/300",
    "Bé An có một chiếc ô màu đỏ rất đẹp. Một hôm đi học về trời đổ mưa to, An che ô cho một chú chó nhỏ đang co ro bên đường. Kì lạ thay, từ lúc đó chiếc ô bắt đầu phát ra ánh sáng lấp lánh và giữ cho cả hai không bị ướt một giọt nước nào. Về sau, cứ mỗi lần An dùng chiếc ô để che chở cho ai đó, chiếc ô lại in thêm một hình ngôi sao nhỏ trên vải. An hiểu ra rằng, chính lòng tốt và sự sẻ chia của mình mới là phép màu thực sự giúp chiếc ô trở nên đặc biệt.",
  ),
  createBook(
    "story-09",
    "Sư Tử và Chuột Nhắt",
    "Truyện ngụ ngôn Aesop",
    "Ngụ ngôn",
    "medium",
    "https://picsum.photos/200/300",
    "Một chú Chuột Nhắt vô tình chạy ngang qua mặt một con Sư Tử đang ngủ, làm Sư Tử tỉnh giấc. Sư Tử tức giận tóm lấy Chuột. Chuột van xin: 'Xin ngài tha mạng, biết đâu một ngày nào đó tôi có thể giúp lại ngài!'. Sư Tử bật cười vì nghĩ một con chuột bé nhỏ thì làm được gì, nhưng rồi cũng thả Chuột đi. Vài ngày sau, Sư Tử không may bị sập bẫy của thợ săn, bị trói chặt trong lưới. Nghe tiếng rống tuyệt vọng của Sư Tử, Chuột chạy đến. Nó dùng hàm răng sắc nhọn cắn đứt từng sợi dây thừng. Sư Tử thoát nạn và nhận ra rằng, dù nhỏ bé đến đâu cũng có giá trị riêng của mình.",
  ),
  createBook(
    "story-10",
    "Hũ vàng của người nông dân",
    "Truyện cổ tích",
    "Cổ tích",
    "hard",
    "https://picsum.photos/200/300",
    "Người nông dân nọ làm việc quần quật suốt đời trên mảnh ruộng khô cằn. Trước khi mất, ông gọi các con lại và bảo: 'Cha có chôn một hũ vàng dưới ruộng, các con hãy đào lên mà chia nhau'. Sau khi cha mất, ba người con trai lười biếng bắt đầu ra sức cuốc xới, cày sâu cuốc bẫm toàn bộ khu ruộng để tìm vàng nhưng tuyệt nhiên không thấy gì. Sẵn đất đã được cày xới kỹ lưỡng, họ bèn gieo hạt trồng lúa. Mùa thu hoạch năm đó, lúa trĩu hạt, cống hiến một vụ mùa bội thu chưa từng có. Bấy giờ, những người con mới hiểu ra 'hũ vàng' thực sự mà cha muốn để lại chính là sức lao động và sự chăm chỉ làm lụng.",
  ),
];

export const getBookById = (id: string): Book | undefined => {
  return sampleBooks.find((book) => book.id === id);
};
