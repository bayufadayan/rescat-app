<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user as author (admin/default user)
        $author = User::first();
        
        if (!$author) {
            $this->command->error('No users found! Please create a user first.');
            return;
        }

        $articles = [
            [
                'title' => 'Cara Merawat Kucing Persia: Panduan Lengkap untuk Pemula',
                'slug' => 'cara-merawat-kucing-persia-panduan-lengkap',
                'content' => "Kucing Persia adalah salah satu ras kucing yang paling populer di dunia. Dengan bulu panjang dan wajah yang lucu, mereka membutuhkan perawatan khusus agar tetap sehat dan cantik.\n\n**1. Perawatan Bulu**\nBulu kucing Persia yang panjang dan lebat memerlukan penyisiran rutin setiap hari. Gunakan sisir khusus untuk mencegah kusut dan bola bulu. Mandikan kucing Persia setidaknya sebulan sekali dengan shampo khusus kucing.\n\n**2. Makanan Bergizi**\nBerikan makanan berkualitas tinggi yang kaya protein. Kucing Persia cenderung kurang aktif, jadi pastikan porsi makanannya sesuai untuk mencegah obesitas.\n\n**3. Kesehatan Mata**\nKucing Persia rentan mengalami masalah mata seperti mata berair. Bersihkan area mata secara rutin dengan kapas lembab untuk mencegah infeksi.\n\n**4. Pemeriksaan Rutin**\nBawa kucing Persia ke dokter hewan minimal 2 kali setahun untuk pemeriksaan kesehatan dan vaksinasi.\n\nDengan perawatan yang tepat, kucing Persia Anda akan hidup bahagia dan sehat selama bertahun-tahun!",
                'author_id' => $author->id,
            ],
            [
                'title' => '7 Tanda Kucing Anda Sakit yang Harus Segera Diperhatikan',
                'slug' => '7-tanda-kucing-anda-sakit',
                'content' => "Sebagai pemilik kucing yang bertanggung jawab, penting untuk mengenali tanda-tanda ketika kucing Anda tidak sehat. Berikut adalah 7 tanda yang harus segera diperhatikan:\n\n**1. Kehilangan Nafsu Makan**\nJika kucing Anda menolak makan selama lebih dari 24 jam, ini bisa menjadi tanda masalah kesehatan serius.\n\n**2. Muntah Berkepanjangan**\nMuntah sesekali mungkin normal, tetapi muntah terus-menerus atau berdarah memerlukan perhatian medis segera.\n\n**3. Diare atau Sembelit**\nPerubahan drastis dalam kebiasaan buang air besar bisa mengindikasikan masalah pencernaan atau parasit.\n\n**4. Lesu dan Tidak Aktif**\nKucing yang sehat biasanya aktif dan playful. Jika kucing Anda tiba-tiba menjadi sangat lesu, segera konsultasi ke dokter hewan.\n\n**5. Kesulitan Bernapas**\nNapas yang cepat, tersengal-sengal, atau mengi adalah tanda darurat yang memerlukan perawatan segera.\n\n**6. Perubahan Perilaku**\nKucing yang biasanya ramah menjadi agresif atau bersembunyi terus-menerus bisa jadi sedang kesakitan.\n\n**7. Mata atau Hidung Berair**\nKeluarnya cairan dari mata atau hidung, terutama jika berwarna hijau atau kuning, bisa jadi tanda infeksi.\n\nJangan menunda untuk membawa kucing Anda ke dokter hewan jika Anda melihat tanda-tanda ini!",
                'author_id' => $author->id,
            ],
            [
                'title' => 'Penyakit Kulit pada Kucing: Mengenali dan Mengobatinya',
                'slug' => 'penyakit-kulit-kucing-mengenali-mengobati',
                'content' => "Penyakit kulit adalah masalah umum yang sering dialami kucing. Mengenali gejala sejak dini sangat penting untuk pengobatan yang efektif.\n\n**Jenis-Jenis Penyakit Kulit pada Kucing:**\n\n**1. Ringworm (Jamur)**\nTandanya: bercak melingkar tanpa bulu, kulit bersisik, dan gatal. Ringworm sangat menular dan bisa ditularkan ke manusia.\n\n**2. Scabies (Kudis)**\nDisebabkan oleh tungau, menyebabkan gatal parah, kerontokan bulu, dan kulit berkerak.\n\n**3. Dermatitis Alergi**\nReaksi alergi terhadap makanan, gigitan kutu, atau faktor lingkungan. Gejalanya termasuk gatal, kemerahan, dan luka garukan.\n\n**4. Infeksi Bakteri**\nBiasanya terjadi sebagai infeksi sekunder dari luka atau alergi. Kulit menjadi merah, bengkak, dan bernanah.\n\n**Cara Pencegahan:**\n- Jaga kebersihan lingkungan kucing\n- Berikan nutrisi yang baik\n- Lakukan grooming rutin\n- Vaksinasi tepat waktu\n- Hindari kontak dengan kucing yang sakit\n\n**Pengobatan:**\nSegera konsultasi dengan dokter hewan untuk diagnosis yang tepat. Pengobatan bisa meliputi obat antijamur, antibiotik, atau salep topikal tergantung jenis penyakitnya.\n\nDengan teknologi AI seperti Rescat, Anda bisa melakukan deteksi dini penyakit kulit pada kucing Anda!",
                'author_id' => $author->id,
            ],
            [
                'title' => 'Nutrisi Penting untuk Kesehatan Kulit dan Bulu Kucing',
                'slug' => 'nutrisi-penting-kesehatan-kulit-bulu-kucing',
                'content' => "Kesehatan kulit dan bulu kucing sangat dipengaruhi oleh nutrisi yang mereka terima. Berikut adalah panduan nutrisi penting untuk kucing Anda.\n\n**1. Protein Berkualitas Tinggi**\nKucing adalah karnivora obligat yang membutuhkan protein hewani. Protein membantu pertumbuhan dan perbaikan jaringan kulit serta produksi keratin untuk bulu yang sehat.\n\nSumber terbaik: daging ayam, ikan, daging sapi, dan telur.\n\n**2. Asam Lemak Omega-3 dan Omega-6**\nAsam lemak esensial ini penting untuk:\n- Mengurangi peradangan kulit\n- Menjaga kelembaban kulit\n- Membuat bulu berkilau dan lembut\n\nSumber: minyak ikan, minyak salmon, biji rami.\n\n**3. Vitamin A**\nPenting untuk regenerasi sel kulit dan produksi sebum yang menjaga kelembaban kulit.\n\nSumber: hati, wortel, bayam.\n\n**4. Vitamin E**\nAntioksidan kuat yang melindungi sel kulit dari kerusakan dan meningkatkan sistem kekebalan tubuh.\n\nSumber: minyak nabati, kacang-kacangan (dalam jumlah kecil).\n\n**5. Biotin (Vitamin B7)**\nMembantu metabolisme lemak dan protein, penting untuk kesehatan kulit dan bulu.\n\n**6. Zinc**\nMineral penting untuk penyembuhan luka dan kesehatan kulit.\n\n**Tips Pemberian Makanan:**\n- Pilih makanan kucing premium dengan label 'complete and balanced'\n- Hindari memberi makanan manusia yang berbahaya bagi kucing\n- Pastikan selalu ada air bersih tersedia\n- Konsultasi dengan dokter hewan tentang suplemen jika diperlukan\n\nNutrisi yang tepat adalah investasi terbaik untuk kesehatan jangka panjang kucing Anda!",
                'author_id' => $author->id,
            ],
            [
                'title' => 'Grooming Kucing di Rumah: Tips dan Trik dari Ahli',
                'slug' => 'grooming-kucing-di-rumah-tips-trik',
                'content' => "Grooming bukan hanya tentang penampilan, tetapi juga kesehatan kucing Anda. Berikut adalah panduan lengkap grooming kucing di rumah.\n\n**Perlengkapan yang Dibutuhkan:**\n- Sisir dan sikat yang sesuai dengan jenis bulu\n- Gunting kuku kucing\n- Shampo khusus kucing\n- Handuk lembut\n- Cotton buds untuk membersihkan telinga\n- Sikat gigi kucing (opsional)\n\n**Langkah-Langkah Grooming:**\n\n**1. Menyisir Bulu (Setiap Hari)**\n- Mulai dari kepala ke ekor dengan gerakan lembut\n- Perhatikan area yang mudah kusut: belakang telinga, ketiak, perut\n- Untuk bulu panjang: gunakan sisir bergigi jarang dulu, lalu sisir halus\n- Untuk bulu pendek: sikat berbulu lembut sudah cukup\n\n**2. Memandikan (Sebulan Sekali)**\n- Gunakan air hangat, bukan panas\n- Basahi bulu secara perlahan, hindari area wajah\n- Aplikasikan shampo khusus kucing, pijat lembut\n- Bilas hingga bersih, pastikan tidak ada sisa shampo\n- Keringkan dengan handuk, hindari hair dryer kecuali kucing sudah terbiasa\n\n**3. Memotong Kuku (2-3 Minggu Sekali)**\n- Tekan lembut bantalan kaki untuk mengeluarkan kuku\n- Potong hanya ujung putih/transparan, hindari bagian pink (quick)\n- Jika tidak yakin, potong sedikit demi sedikit\n\n**4. Membersihkan Telinga (Mingguan)**\n- Gunakan cotton bud yang dibasahi dengan pembersih telinga khusus\n- Bersihkan hanya bagian luar yang terlihat\n- Jangan masukkan terlalu dalam\n\n**5. Menjaga Kesehatan Gigi**\n- Sikat gigi kucing 2-3 kali seminggu jika memungkinkan\n- Gunakan pasta gigi khusus kucing (JANGAN gunakan pasta gigi manusia)\n\n**Tips Penting:**\n- Mulai grooming sejak kucing masih kecil agar terbiasa\n- Berikan reward (treat) setelah grooming\n- Jika kucing stres, bagi sesi grooming menjadi beberapa kali\n- Untuk kucing yang sangat menolak, pertimbangkan layanan grooming profesional\n\nGrooming rutin akan mempererat ikatan Anda dengan kucing dan menjaga mereka tetap sehat!",
                'author_id' => $author->id,
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }

        $this->command->info('5 artikel berhasil ditambahkan!');
    }
}
